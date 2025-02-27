import { google } from "googleapis";
import { getJson } from "serpapi";
import axios from "axios";
import { tags } from "typia";
import { IGoogleMapService } from "../structures/IGoogleMapService";
import { createQueryParameter } from "@wrtnlabs/connector-shared";

export class GoogleMapService {
  constructor(private readonly props: IGoogleMapService.IProps) {}
  /**
   * 1,000회 요청 당 2.83 달러를 사용하나, Google Map은 매 달 200달러까지는 무료 사용이 가능하다.
   * 다른 API 사용량과 합산하여 금액이 결정된다.
   *
   * @param input
   * @returns
   */
  async autocomplete(
    input: IGoogleMapService.IAutocompleteInput,
  ): Promise<IGoogleMapService.IAutocompleteOutput> {
    const places = await google.places("v1").places.autocomplete(
      {
        requestBody: {
          input: input.input,
          locationBias: {
            circle: {
              center: {
                latitude: input.circle?.latitude,
                longitude: input.circle?.longitude,
              },
              radius: input.circle?.radius ?? 500,
            },
          },
        },
        key: this.props.googleApiKey,
      },
      {
        headers: {
          "X-Goog-FieldMask": "*",
        },
      },
    );

    const suggestions = places.data.suggestions;
    return {
      suggestions: suggestions?.map((suggestion) => {
        const text = suggestion.placePrediction?.text?.text ?? null;
        const types = suggestion.placePrediction?.types ?? [];
        return {
          placePrediction: suggestion.placePrediction
            ? {
                placeId: suggestion.placePrediction?.placeId,
                text: { text },
                types,
              }
            : null,
        };
      }),
    };
  }

  async getPhoto(input: {
    photoResourceName: `places/${string}/photos/${string}`;
  }): Promise<{
    name: string;
    photoUri: string & tags.Format<"iri">;
  }> {
    const { photoResourceName } = input;
    const queryParameter = createQueryParameter({
      key: this.props.googleApiKey,
      maxHeightPx: 1600,
      skipHttpRedirect: true,
    });

    const url = `https://places.googleapis.com/v1/${photoResourceName}/media?${queryParameter}`;
    const res = await axios.get(url);
    return res.data;
  }

  async searchText(
    input: IGoogleMapService.ISearchTextInput,
  ): Promise<IGoogleMapService.ISearchTextOutput> {
    try {
      const response = await google.places("v1").places.searchText(
        {
          requestBody: {
            textQuery: input.textQuery,
            pageToken: input.nextPageToken,
          },
          key: this.props.googleApiKey,
        },
        {
          headers: {
            "X-Goog-FieldMask": "*",
          },
        },
      );

      const nextPageToken = response.data.nextPageToken ?? null;

      return {
        nextPageToken,
        places: await Promise.all(
          (response.data.places ?? []).map(async (place) => {
            place.photos = await Promise.all(
              (place.photos ?? [])
                .filter((photo) => photo.name)
                .slice(0, 1) // 썸네일 용도로 사용할 것이기 때문에 1장만 제공되게 한다.
                .map(async (photo) => {
                  const name = `${photo.name}`;
                  const { photoUri } = await this.getPhoto(name as any);
                  return { ...photo, link: photoUri };
                }),
            );

            return place;
          }),
        ),
      };
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  async search(
    input: IGoogleMapService.IRequest,
  ): Promise<IGoogleMapService.IResponse[]> {
    try {
      const params = {
        engine: "google_maps",
        type: "search",
        q: input.keyword,
        google_domain: "google.com",
        hl: "ko",
        api_key: this.props.serpApiKey,
      };

      const res = await getJson(params);
      const results = res["local_results"] ?? [res.place_results];

      const output: IGoogleMapService.IResponse[] = [];
      for (const result of results) {
        const data: IGoogleMapService.IResponse = {
          title: result.title,
          place_id: result.place_id,
          gps_coordinate: result.gps_coordinates,
          rating: result?.rating ?? 0,
          reviews: result?.reviews,
          address: result.address,
          open_state: result?.open_state,
          operating_hours: result?.operating_hours,
          phone_number: result?.phone,
          service_options: result?.service_options,
          user_review: result?.user_review,
          thumbnail: result.thumbnail,
        };
        output.push(data);
      }
      // rating이 undefined일 경우 0으로 처리
      output.sort((a, b) => b.rating! - a.rating!);
      return output;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  async review(
    input: IGoogleMapService.IReviewRequest,
  ): Promise<IGoogleMapService.IReviewResponse[]> {
    try {
      const params = {
        engine: "google_maps",
        type: "search",
        google_domain: "google.com",
        hl: "ko",
        place_id: input.place_id,
        api_key: this.props.serpApiKey,
      };

      const res = await getJson(params);
      const results = res["place_results"].user_reviews.most_relevant;

      const output: IGoogleMapService.IReviewResponse[] = [];
      for (const result of results) {
        const data: IGoogleMapService.IReviewResponse = {
          username: result.username,
          rating: result.rating,
          description: result.description,
          link: result.link,
          images: result.images?.map((image: any) => image.thumbnail) ?? [],
          date: result.date,
        };
        output.push(data);
      }
      return output;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }
}
