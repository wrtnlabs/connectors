import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { RouteIcon, Standalone } from "@wrtnio/decorators";

import { IGoogleSheet } from "@wrtn/connector-api/lib/structures/connector/google_sheet/IGoogleSheet";

import { ApiTags } from "@nestjs/swagger";
import { GoogleSheetProvider } from "../../../providers/connector/google_sheet/GoogleSheetProvider";
import { retry } from "../../../utils/retry";

@Controller("connector/google-sheet")
export class GoogleSheetController {
  /**
   * Get the header information of a Google Sheet
   *
   * @summary Get the header information of a Google Sheet
   * @param input Google Sheet URL and the header index to get
   * @returns Google Sheet header information
   */
  @Standalone()
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/google_sheets.svg",
  )
  @ApiTags("Google Sheet")
  @core.TypedRoute.Patch()
  async getHeaders(
    @core.TypedBody() input: IGoogleSheet.IReadGoogleSheetHeadersInput,
  ): Promise<IGoogleSheet.IReadGoogleSheetOutput> {
    return retry(() => GoogleSheetProvider.readHeaders(input))();
  }

  /**
   * Add content to Google Sheets
   *
   * @summary Add content to Google Sheets
   * @param input Information to add content
   * @returns
   */
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/google_sheets.svg",
  )
  @ApiTags("Google Sheet")
  @core.TypedRoute.Post("append")
  async appendGoogleSheet(
    @core.TypedBody() input: IGoogleSheet.IAppendToSheetInput,
  ): Promise<IGoogleSheet.ICreateGoogleSheetOutput> {
    return retry(() => GoogleSheetProvider.appendToSheet(input))();
  }

  /**
   * Create a Google Sheet
   *
   * The created sheet will be created in the Google Drive root path.
   *
   * @summary Create a Google Sheet
   * @param input The title of the sheet to be created
   * @returns The created sheet id and Url
   */
  @Standalone()
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/google_sheets.svg",
  )
  @ApiTags("Google Sheet")
  @core.TypedRoute.Post("create")
  async createGoogleSheet(
    @core.TypedBody() input: IGoogleSheet.ICreateGoogleSheetInput,
  ): Promise<IGoogleSheet.ICreateGoogleSheetOutput> {
    return retry(() => GoogleSheetProvider.createSpreadsheet(input))();
  }

  /**
   * Grant permissions to Google Sheets
   *
   * @summary Grant permissions to Google Sheets
   * @param input Information for granting permissions
   */
  @Standalone()
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/google_sheets.svg",
  )
  @ApiTags("Google Sheet")
  @core.TypedRoute.Post("/permission")
  async permission(
    @core.TypedBody() input: IGoogleSheet.IPermissionInput,
  ): Promise<void> {
    return retry(() => GoogleSheetProvider.permission(input))();
  }

  /**
   * Add a header to a Google Sheet
   *
   * @summary Add a Google Sheet header
   * @param input The Google Sheet url and the header name to add
   */
  @Standalone()
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/google_sheets.svg",
  )
  @ApiTags("Google Sheet")
  @core.TypedRoute.Post("/header")
  async writeHeaders(
    @core.TypedBody() input: IGoogleSheet.IWriteGoogleSheetHeadersInput,
  ): Promise<void> {
    return retry(() => GoogleSheetProvider.writeHeaders(input))();
  }

  /**
   * Get a list of Google Worksheets
   *
   * @summary Get a list of Google Sheets Worksheets
   * @param input The Google Sheets url to get the list of worksheets
   */
  @Standalone()
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/google_sheets.svg",
  )
  @ApiTags("Google Sheet")
  @core.TypedRoute.Patch("/worksheet")
  async getWorkSheet(
    @core.TypedBody() input: IGoogleSheet.IGetWorkSheetInput,
  ): Promise<IGoogleSheet.IGetWorkSheetOutput> {
    return retry(() => GoogleSheetProvider.getWorkSheet(input))();
  }

  /**
   * Get Row information from Google Sheets
   *
   * @summary Get Row information from Google Sheets
   * @returns Row information from Google Sheets
   * @Todo determine api endpoint in later because not decided select options
   */
  @Standalone()
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/google_sheets.svg",
  )
  @ApiTags("Google Sheet")
  @core.TypedRoute.Patch("/get-rows")
  async readRows(
    @core.TypedBody() input: IGoogleSheet.IReadGoogleSheetRowsInput,
  ): Promise<IGoogleSheet.IReadGoogleSheetRowsOutput> {
    return retry(() => GoogleSheetProvider.readRows(input))();
  }
}
