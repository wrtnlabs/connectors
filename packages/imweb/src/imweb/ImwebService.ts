import axios from "axios";
import { IImwebService } from "../structures/IImwebService";

export class ImwebService {
  constructor(private readonly props: IImwebService.IProps) {}

  /**
   * Imweb Service.
   *
   * Look up the sales product
   *
   * The `Imweb` seller uses the seller's authentication key and secret to import his or her product.
   * `Imweb` is a Korean webbuilder site that offers a similar experience to the service called Wix.
   * If a commerce site is opened using `Imweb`,
   * sellers can register the items they are selling,
   * which is only available to sellers who open `Imweb` pages and is intended to bring up their products.
   * Sellers must provide their API keys and secrets to import `Imweb` products.
   */
  async getProducts(
    input: IImwebService.IGetProductInput,
  ): Promise<IImwebService.IProduct[]> {
    try {
      const { access_token } = await this.getAccessToken();
      const queryParameter = Object.entries({
        prod_status: input.prod_status,
        category: input.category,
      })
        .filter(([_key, value]) => value !== undefined)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

      const res = await axios.get(
        `https://api.imweb.me/v2/shop/products?${queryParameter}`,
        {
          headers: {
            "access-token": access_token,
          },
        },
      );

      const data = res.data as IImwebService.IGetProductOutput;
      return (
        data.data.list.map((product) => {
          const image_url = Object.values(product.image_url).map(
            (url) => `https://cdn.imweb.me/upload/${url}`,
          );

          return { ...product, image_url };
        }) ?? []
      );
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * Imweb Service.
   *
   * Issue Aimweb Access Token
   */
  async getAccessToken(): Promise<IImwebService.IGetAccessTokenOutput> {
    try {
      const res = await axios.get(
        `https://api.imweb.me/v2/auth?key=${this.props.key}&secret=${this.props.secret}`,
      );

      return res.data;
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }
}
