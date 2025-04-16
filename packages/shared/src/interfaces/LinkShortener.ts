import { ILinkShortener } from "../structures";

/**
 * Link Shortener Interface for example Bitly, TinyURL, Short.io, etc.
 */
export interface LinkShortener {
  /**
   * Shorten link.
   *
   * Shorten URL Link.
   */
  shorten(
    input: ILinkShortener.IShortenInput,
  ): Promise<ILinkShortener.IShortenOutput>;
}
