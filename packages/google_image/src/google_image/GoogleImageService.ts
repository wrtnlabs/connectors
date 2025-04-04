import { getJson } from "serpapi";
import { IGoogleImageService } from "../structures/IGoogleImageService";

export class GoogleImageService {
  constructor(private readonly props: IGoogleImageService.IProps) {}

  /**
   * Google Image Service.
   *
   * Search Google for images based on the search terms you enter
   */
  async search(
    input: IGoogleImageService.IRequest,
  ): Promise<IGoogleImageService.IResponse[]> {
    try {
      const params = {
        engine: "google_images",
        q: input.query,
        api_key: this.props.serpApiKey,
        hl: input.lang,
        gl: input.lang === "ko" ? "kr" : input.lang === "en" ? "us" : "jp",
        imgar: input.ratio,
        safe: "active",
      };

      const output: IGoogleImageService.IResponse[] = [];
      const res = await getJson(params);
      const results = res["images_results"];

      if (results.length === 0) {
        return [];
      }

      for (const result of results) {
        output.push({
          title: result.title,
          imageUrl: result.link,
          thumbnail: result.thumbnail,
        });
      }
      return output;
    } catch (err) {
      console.error(`Failed to get Google Image search result: ${err}`);
      throw err;
    }
  }
}
