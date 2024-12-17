import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { IGoogleShopping } from "@wrtn/connector-api/lib/structures/connector/google_shopping/IGoogleShopping";
import { RouteIcon, SelectBenchmark, Standalone } from "@wrtnio/decorators";
import { GoogleShoppingProvider } from "../../../../providers/connector/google_shopping/GoogleShoppingProvider";
import { retry } from "../../../../utils/retry";

@Controller("connector/google-shopping")
export class GoogleShoppingMusinsaController {
  constructor(
    private readonly googleShoppingProvider: GoogleShoppingProvider,
  ) {}

  /**
   * Search for products in Musinsa
   * Musinsa is a service that allows you to purchase clothes or shoes.
   * Only one item should be requested per request.
   * This connector only processes one search term at a time, so if you want to search for multiple terms, you will need to call this connector separately for each search term.
   *
   * @summary Musinsa Search
   * @param input Search conditions
   * @returns Search results
   */
  @SelectBenchmark("무신사에서 상품 좀 찾아줘")
  @Standalone()
  @core.TypedRoute.Post("musinsa")
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icon/fulls/Musinsa_full.svg",
  )
  @ApiTags("Musinsa")
  async musinsa(
    @core.TypedBody() input: IGoogleShopping.IRequestStandAlone,
  ): Promise<IGoogleShopping.IResponse[]> {
    return retry(() => this.googleShoppingProvider.musinsa(input))();
  }
}
