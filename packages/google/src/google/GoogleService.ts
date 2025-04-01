import { google } from "googleapis";
import { IGoogleService } from "../structures/IGoogleService";

export class GoogleService {
  constructor(private readonly props: IGoogleService.IProps) {}

  /**
   * Google Auth Service.
   *
   * Request to reissue Google access token
   */
  async refreshAccessToken(): Promise<string> {
    const client = new google.auth.OAuth2(
      this.props.clientId,
      this.props.clientSecret,
    );

    client.setCredentials({
      refresh_token: decodeURIComponent(this.props.secret),
    });
    const { credentials } = await client.refreshAccessToken();
    const accessToken = credentials.access_token;

    if (!accessToken) {
      throw new Error("Failed to refresh access token");
    }

    return accessToken;
  }
}
