import { SnakeToCamel, ILinkShortener } from "@wrtnlabs/connector-shared";

export const ENV_LIST = ["SHORT_IO_API_KEY"] as const;

/**
 * Short.io Service Interface.
 *
 * @author michael
 */
export namespace IShortIoService {
  /**
   *
   */
  export type IProps = {
    [key in SnakeToCamel<(typeof ENV_LIST)[number]>]: string;
  } & {
    domain: string;
  };

  /**
   * Shorten url input
   */
  export interface IShortenInput extends ILinkShortener.IShortenInput {}

  /**
   * Shorten url output
   */
  export interface IShortenOutput extends ILinkShortener.IShortenOutput {}
}
