import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";
import { google } from "googleapis";
import { IGoogleSheetService } from "../structures/IGoogleSheetService";
import { GoogleService } from "@wrtnlabs/connector-google";
import { ISpreadsheet, ISpreadsheetCell } from "@wrtnlabs/connector-shared";
import { AxiosError } from "axios";

export class GoogleSheetService {
  constructor(private readonly props: IGoogleSheetService.IProps) {}

  /**
   * Create Google Sheet
   */
  async createSpreadsheet(
    input: IGoogleSheetService.ICreateGoogleSheetInput,
  ): Promise<IGoogleSheetService.ICreateGoogleSheetOutput> {
    try {
      const googleService = new GoogleService({
        clientId: this.props.clientId,
        clientSecret: this.props.clientSecret,
        secret: this.props.secret,
      });

      const accessToken = await googleService.refreshAccessToken();
      const authClient = new google.auth.OAuth2();

      authClient.setCredentials({ access_token: accessToken });

      const sheets = google.sheets({ version: "v4", auth: authClient });

      const response = await sheets.spreadsheets.create({
        requestBody: {
          properties: {
            title: input.title,
          },
        },
      });

      const spreadsheetId = response.data.spreadsheetId;
      const spreadsheetUrl = response.data.spreadsheetUrl;

      if (!spreadsheetId || !spreadsheetUrl) {
        throw new Error("Failed to create spreadsheet");
      }

      return {
        spreadsheetId,
        spreadsheetUrl,
      };
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  async insertCells(input: {
    spreadsheetId: string;
    cells: ISpreadsheetCell.ICreate[];
  }) {
    const googleService = new GoogleService({
      clientId: this.props.clientId,
      clientSecret: this.props.clientSecret,
      secret: this.props.secret,
    });

    const accessToken = await googleService.refreshAccessToken();
    const authClient = new google.auth.OAuth2();
    authClient.setCredentials({ access_token: accessToken });

    await google
      .sheets({ version: "v4", auth: authClient })
      .spreadsheets.batchUpdate({
        spreadsheetId: input.spreadsheetId,
        requestBody: {
          requests: input.cells.map((cell) => {
            return {
              updateCells: {
                range: {
                  /**
                   * @todo 시트 아이디를 지정할 수 있게 하기
                   */
                  sheetId: 0, // 0번째 시트를 의미
                  startRowIndex: cell.row - 1,
                  startColumnIndex: cell.column - 1,
                  endRowIndex: cell.row,
                  endColumnIndex: cell.column,
                },
                rows: [
                  {
                    values: [
                      {
                        userEnteredValue: { stringValue: cell.snapshot.value },
                      },
                    ],
                  },
                ],
                fields: "*",
              },
            };
          }),
        },
      });
  }

  /**
   * Append To Sheet
   */
  async appendToSheet(
    input: IGoogleSheetService.IAppendToSheetInput,
  ): Promise<IGoogleSheetService.ICreateGoogleSheetOutput> {
    try {
      const googleService = new GoogleService({
        clientId: this.props.clientId,
        clientSecret: this.props.clientSecret,
        secret: this.props.secret,
      });

      const { values, spreadSheetId } = input;
      const accessToken = await googleService.refreshAccessToken();
      const authClient = new google.auth.OAuth2();

      authClient.setCredentials({ access_token: accessToken });
      const sheets = google.sheets({ version: "v4", auth: authClient });

      const res = await sheets.spreadsheets.values.append({
        spreadsheetId: spreadSheetId,
        valueInputOption: "RAW",
        requestBody: {
          values: values,
        },
        range: "A1:Z1000",
      });

      const spreadsheetId = res.data.spreadsheetId;
      if (!spreadsheetId) {
        throw new Error("Error to append rows.");
      }

      const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;
      return { spreadsheetId: spreadsheetId, spreadsheetUrl };
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(JSON.stringify(error.response?.data));
      } else {
        console.error(JSON.stringify(error));
      }
      throw error;
    }
  }

  /**
   * Read Google Sheet Headers
   * @param input Google Sheet Url and index number(default 0)
   */
  async readHeaders(
    input: IGoogleSheetService.IReadGoogleSheetHeadersInput,
  ): Promise<IGoogleSheetService.IReadGoogleSheetOutput> {
    try {
      const googleService = new GoogleService({
        clientId: this.props.clientId,
        clientSecret: this.props.clientSecret,
        secret: this.props.secret,
      });

      const { url, index = 0 } = input;
      const id = this.getSpreadSheetId(url);
      const accessToken = await googleService.refreshAccessToken();
      const authClient = new google.auth.OAuth2();

      authClient.setCredentials({ access_token: accessToken });

      const doc = new GoogleSpreadsheet(id, authClient);
      await doc.loadInfo();
      const sheet = doc.sheetsByIndex[index]!;
      await sheet.getRows();
      const headerValues = sheet.headerValues;

      // 아무런 헤더 정보가 존재하지 않을 때
      if (!headerValues) {
        return { data: [] };
      }

      return { data: headerValues };
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * Add Permission to Google Sheet
   * @param input Google Sheet Url and Permission List including email and role
   */
  async permission(input: IGoogleSheetService.IPermissionInput): Promise<void> {
    const googleService = new GoogleService({
      clientId: this.props.clientId,
      clientSecret: this.props.clientSecret,
      secret: this.props.secret,
    });

    const { url, permissions } = input;
    const id = this.getSpreadSheetId(url);
    const accessToken = await googleService.refreshAccessToken();
    const authClient = new google.auth.OAuth2();

    authClient.setCredentials({ access_token: accessToken });

    const doc = new GoogleSpreadsheet(id, authClient);
    for (let i = 0; i < permissions.length; i++) {
      try {
        await doc.share(permissions[i]!.email, {
          role: permissions[i]!.role,
          emailMessage: false,
        });
      } catch (err) {
        /**
         * @todo 권한 할당에 실패한 경우를 찾아서 재실행하거나 유저에게 알려줄 수 있어야 한다.
         */
        console.error(JSON.stringify(err));
      }
    }
  }

  /**
   * Add new Headers to Google Sheet
   * @param input Google Sheet Url and new Header Names
   */
  async writeHeaders(
    input: IGoogleSheetService.IWriteGoogleSheetHeadersInput,
  ): Promise<void> {
    try {
      const googleService = new GoogleService({
        clientId: this.props.clientId,
        clientSecret: this.props.clientSecret,
        secret: this.props.secret,
      });

      const { url, headerNames, index = 0 } = input;
      const accessToken = await googleService.refreshAccessToken();
      const authClient = new google.auth.OAuth2();

      authClient.setCredentials({ access_token: accessToken });

      const doc = new GoogleSpreadsheet(this.getSpreadSheetId(url), authClient);
      await doc.loadInfo();
      const sheet = doc.sheetsByIndex[index]!;

      // 현재 헤더를 가져옵니다.
      await sheet.loadHeaderRow();
      const _headers = sheet.headerValues;

      // 새로운 헤더를 추가합니다.
      for (let i = 0; i < headerNames.length; i++) {
        if (!_headers.includes(headerNames[i]!)) {
          _headers.push(headerNames[i]!);
        }
      }

      // 수정된 헤더를 다시 설정합니다.
      await sheet.setHeaderRow(_headers);
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  async getWorkSheet(
    input: IGoogleSheetService.IGetWorkSheetInput,
  ): Promise<IGoogleSheetService.IGetWorkSheetOutput> {
    try {
      const googleService = new GoogleService({
        clientId: this.props.clientId,
        clientSecret: this.props.clientSecret,
        secret: this.props.secret,
      });

      const { url } = input;
      const id = this.getSpreadSheetId(url);
      const accessToken = await googleService.refreshAccessToken();
      const authClient = new google.auth.OAuth2();

      authClient.setCredentials({ access_token: accessToken });

      const doc = new GoogleSpreadsheet(id, authClient);
      await doc.loadInfo();
      const workSheets = doc.sheetsByIndex;
      const res = workSheets.map((worksheet: GoogleSpreadsheetWorksheet) => {
        return worksheet.title;
      });
      return { data: res };
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  async readRows(
    input: IGoogleSheetService.IReadGoogleSheetRowsInput,
  ): Promise<IGoogleSheetService.IReadGoogleSheetRowsOutput> {
    try {
      const googleService = new GoogleService({
        clientId: this.props.clientId,
        clientSecret: this.props.clientSecret,
        secret: this.props.secret,
      });

      const { url, workSheetTitle } = input;
      const id = this.getSpreadSheetId(url);
      const accessToken = await googleService.refreshAccessToken();
      const authClient = new google.auth.OAuth2();

      authClient.setCredentials({ access_token: accessToken });

      const doc = new GoogleSpreadsheet(id, authClient);
      await doc.loadInfo();
      const sheet = doc.sheetsByTitle[workSheetTitle]!;
      const rows = await sheet.getRows();
      const _headers = sheet.headerValues;

      const res = [];
      for (let i = 0; i < rows.length; i++) {
        const obj: Record<string, string> = {};
        for (let j = 0; j < _headers.length; j++) {
          obj[_headers[j]!]! = rows[i]?.get(_headers[j]!);
        }
        res.push(obj);
      }

      return { data: res };
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }
  /**
   * Parsing Google Sheet Id from Google Sheet Url
   * @param url Google Sheet Url
   * @private
   */
  private getSpreadSheetId(url: string): string {
    const match = url.match(/\/d\/(.+?)\/edit/);
    return match ? match[1]! : "";
  }
}
