import axios, { AxiosError } from "axios";
import { IHwpService } from "../structures/IHwpService";

export class HwpService {
  constructor(private readonly props: IHwpService.IProps) {}

  async parseHwp(
    input: IHwpService.IParseInput,
  ): Promise<IHwpService.IParseOutput> {
    try {
      const res = await axios.post(this.props.url, input, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return { text: res.data.data };
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response?.data.statusCode === 400) {
          throw new Error(e.response?.data.message);
        }
        throw new Error(e.response?.data.message);
      } else {
        throw e;
      }
    }
  }
}
