import { IKoreaEximbankService } from "../structures/IKoreaEximbankService";

export class KoreaEximbankService {
  constructor(private readonly props: IKoreaEximbankService.IProps) {}

  /**
   * Korea Export-Import Bank Service.
   *
   * Korea Export-Import Bank Current Exchange Rate Inquiry
   */
  async getExchange(): Promise<IKoreaEximbankService.IGetExchangeOutput> {
    try {
      const baseUrl = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON`;

      const url = `${baseUrl}?authkey=${this.props.apiKey}&data=AP01`;

      const res = await fetch(url, {
        headers: {
          "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36`,
        },
      });

      const data = await res.json();

      return data;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }
}
