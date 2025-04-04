import {
  GoogleSearchService,
  IGoogleSearchService,
} from "@wrtnlabs/connector-google-search";
import { ICareerService } from "../structures/ICareerService";

export class CareerService {
  constructor(private readonly props: ICareerService.IProps) {}

  /**
   * Career Service.
   *
   * Search for job postings on Jumpit
   *
   */
  async searchJobByJumpit(
    input: IGoogleSearchService.IRequest,
  ): Promise<IGoogleSearchService.IResponse[]> {
    const googleSearchService = new GoogleSearchService({
      serpApiKey: this.props.serpApiKey,
    });

    return await googleSearchService.searchResult({
      ...input,
      targetSite: "https://www.jumpit.co.kr",
    });
  }

  /**
   * Career Service.
   *
   * Search for job postings on Wanted
   *
   */
  async searchJobByWanted(
    input: IGoogleSearchService.IRequest,
  ): Promise<IGoogleSearchService.IResponse[]> {
    const googleSearchService = new GoogleSearchService({
      serpApiKey: this.props.serpApiKey,
    });

    return await googleSearchService.searchResult({
      ...input,
      targetSite: "https://www.wanted.co.kr",
    });
  }

  /**
   * Career Service.
   *
   * Search for job postings on Incruit
   *
   */
  async searchJobByIncruit(
    input: IGoogleSearchService.IRequest,
  ): Promise<IGoogleSearchService.IResponse[]> {
    const googleSearchService = new GoogleSearchService({
      serpApiKey: this.props.serpApiKey,
    });

    return await googleSearchService.searchResult({
      ...input,
      targetSite: "https://www.incruit.com",
    });
  }

  /**
   * Career Service.
   *
   * Search for job postings on Saramin
   *
   */
  async searchJobBySaramin(
    input: IGoogleSearchService.IRequest,
  ): Promise<IGoogleSearchService.IResponse[]> {
    const googleSearchService = new GoogleSearchService({
      serpApiKey: this.props.serpApiKey,
    });

    return await googleSearchService.searchResult({
      ...input,
      targetSite: "https://www.saramin.co.kr/zf_user",
    });
  }
}
