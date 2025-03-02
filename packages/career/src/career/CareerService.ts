import {
  GoogleSearchService,
  IGoogleSearchService,
} from "@wrtnlabs/connector-google-search";
import { ICareerService } from "../structures/ICareerService";

export class CareerService {
  constructor(private readonly props: ICareerService.IProps) {}

  /**
   * Search for job postings on Jumpit
   *
   */
  async searchJobByJumpit(
    input: IGoogleSearchService.IRequest,
  ): Promise<IGoogleSearchService.IResponse[]> {
    const googleSearchService = new GoogleSearchService({
      apiKey: this.props.apiKey,
    });

    return await googleSearchService.searchResult({
      ...input,
      targetSite: "https://www.jumpit.co.kr",
    });
  }

  /**
   * Search for job postings on Wanted
   *
   */
  async searchJobByWanted(
    input: IGoogleSearchService.IRequest,
  ): Promise<IGoogleSearchService.IResponse[]> {
    const googleSearchService = new GoogleSearchService({
      apiKey: this.props.apiKey,
    });

    return await googleSearchService.searchResult({
      ...input,
      targetSite: "https://www.wanted.co.kr",
    });
  }

  /**
   * Search for job postings on Incruit
   *
   */
  async searchJobByIncruit(
    input: IGoogleSearchService.IRequest,
  ): Promise<IGoogleSearchService.IResponse[]> {
    const googleSearchService = new GoogleSearchService({
      apiKey: this.props.apiKey,
    });

    return await googleSearchService.searchResult({
      ...input,
      targetSite: "https://www.incruit.com",
    });
  }

  /**
   * Search for job postings on Saramin
   *
   */
  async searchJobBySaramin(
    input: IGoogleSearchService.IRequest,
  ): Promise<IGoogleSearchService.IResponse[]> {
    const googleSearchService = new GoogleSearchService({
      apiKey: this.props.apiKey,
    });

    return await googleSearchService.searchResult({
      ...input,
      targetSite: "https://www.saramin.co.kr/zf_user",
    });
  }
}
