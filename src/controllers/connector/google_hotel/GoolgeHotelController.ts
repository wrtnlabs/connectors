import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { RouteIcon, SelectBenchmark, Standalone } from "@wrtnio/decorators";

import { ApiTags } from "@nestjs/swagger";
import { IGoogleHotel } from "@wrtn/connector-api/lib/structures/connector/google_hotel/IGoogleHotel";
import { GoogleHotelProvider } from "../../../providers/connector/google_hotel/GoogleHotelProvider";
import { retry } from "../../../utils/retry";

@Controller("connector/google-hotel")
export class GoogleHotelController {
  constructor(private readonly googleHotelProvider: GoogleHotelProvider) {}

  /**
   * Search for accommodations using Google Hotels service
   * Only one keyword should be requested per request.
   * For example, if you need to enter Seoul and Tokyo as keywords, you should make two requests with one word, "Seoul" and "Tokyo", not "Seoul, Tokyo".
   *
   * @summary Google Hotels Search
   * @param input Google Hotels search criteria
   * @returns Google Hotels Search Results
   */
  @SelectBenchmark("호텔 좀 찾아줘")
  @Standalone()
  @core.TypedRoute.Patch("")
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/google_hotel.svg",
  )
  @ApiTags("Google Hotel")
  async search(
    @core.TypedBody() input: IGoogleHotel.IRequest,
  ): Promise<IGoogleHotel.IResponse[]> {
    return retry(() => this.googleHotelProvider.search(input))();
  }
}
