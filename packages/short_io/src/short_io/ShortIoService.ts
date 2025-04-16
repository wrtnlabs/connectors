import { IShortIoService } from "../structures/IShortIoService";
import { LinkShortener } from "@wrtnlabs/connector-shared";

export class ShortIoService implements LinkShortener {
  constructor(private readonly props: IShortIoService.IProps) {}

  /**
   * Shorten URL.
   *
   * @description rete limit is 50/s
   */
  async shorten(
    input: IShortIoService.IShortenInput,
  ): Promise<IShortIoService.IShortenOutput> {
    const { url, domain } = input;

    const response = await fetch(`https://api.short.io/links`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${this.props.shortIoApiKey}`,
      },
      body: JSON.stringify({ originalURL: url, domain }),
    });

    const data = await response.json();

    /* statusCode and message are only in error response */
    if ("statusCode" in data) {
      throw new Error(data.message);
    }

    return { url: data.shortURL };
  }
}
