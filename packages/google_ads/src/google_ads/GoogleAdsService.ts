import axios, { AxiosError } from "axios";
import { randomUUID } from "crypto";
import typia from "typia";
import { v4 } from "uuid";
import { IGoogleAdsService } from "../structures/IGoogleAdsService";
import {
  Camelize,
  getCroppedImage,
  SelectedColumns,
  StringToDeepObject,
  TypedSplit,
} from "@wrtnlabs/connector-shared";
import { google } from "googleapis";

export class GoogleAdsService {
  private readonly baseUrl = "https://googleads.googleapis.com/v17";

  constructor(private readonly props: IGoogleAdsService.IProps) {}

  /**
   * Google Ads Service.
   *
   * Get Google Ads Customer ID.
   * Check that the user's secret key and the advertising account you want to use are valid.
   * If the ID of the advertising account has not been delivered, it will pass you through even if you do not select it if the length of the advertising account list is 1.
   *
   * @param input
   * @returns
   */
  private async getTargetCustomerId(
    input: IGoogleAdsService.IGetTargetCustomerIdInput,
  ): Promise<IGoogleAdsService.ICustomer["id"]> {
    const customers = await this.getCustomers();
    let customerId: string | null = input.customerId ?? null;
    if (input.customerId) {
      if (!customers.map((el) => el.id).includes(input.customerId)) {
        throw new Error(
          "등록되지 않은 고객 또는 구글에서 심사 중인 고객입니다.",
        );
      }
    } else {
      if (customers.length > 1 && !input.customerId) {
        throw new Error("고객 계정 중 어떤 것을 사용할지 명시해주어야 합니다.");
      } else if (customers.length === 1) {
        customerId = customers[0]!.id;
      }
    }

    if (!customerId) {
      throw new Error("고객 계정이 지정되지 않았습니다.");
    }

    return customerId;
  }

  /**
   * Google Ads Service.
   *
   * Designates Wrtn as the user's advertising account manager.
   * To call the Google Ads API for a specific account, the user must own or administer it.
   * This connector sends invitations to all of the user's Google Ads accounts, requesting admin access for Wrtn.
   * Upon execution, an email is sent to the customer account via Gmail, allowing recipients to grant Wrtn admin rights.
   * Admin access enables Wrtn to use other Google Ads APIs.
   *
   * This step is required before calling most Google Ads connectors, except those not requiring customerId (e.g., keyword recommendations).
   * Admin rights are only granted with user approval.
   *
   * Before calling, prompt the user to check their customerId using a relevant connector.
   */
  async publish(): Promise<void> {
    try {
      await this.getTargetCustomerId({});

      const customers = await this.listAccessibleCustomers();
      for await (const resourceName of customers.resourceNames) {
        await this.createClientLink({
          resourceName: resourceName,
        });
      }
    } catch (err) {
      console.error(
        JSON.stringify(err instanceof AxiosError ? err.response?.data : err),
      );
      throw err;
    }
  }

  /**
   * Google Ads Service.
   *
   * Recommend keywords for Google Ads
   * In order to execute ads in Google Ads, you need to register keywords.
   * A keyword must be registered to target the end users of the ad, and it is one of the `adGroupCriteria` mapped to `adGroup` among the resources of Google Ads.
   * This connector is a function to recommend such keywords, and when the user enters the keywords and URL that he or she wanted to register, it recommends other keywords that can be derived from them.
   *
   * The request result is a list of keywords, the competition index, unit price, and the expected index values for each keyword when registering an ad.
   *
   * This connector excludes keywords for adult ads, and the language condition is set to Korean and the geographical condition is set to Korea (South Korea).
   *
   * Before calling the function, you need to ask the user for `customerId`, so you need to suggest a connector that can check `customerId`.
   */
  async getKeywordsAndUrl(
    input: IGoogleAdsService.IGenerateKeywordIdeaByKeywordsAndUrlInput,
  ): Promise<IGoogleAdsService.IGenerateKeywordIdeaOutput> {
    const customerId = await this.getTargetCustomerId({});

    return await this.generateKeywordIdeas({
      ...input,
      customerId,
    });
  }

  /**
   * Google Ads Service.
   *
   * Get keyword recommendations for Google Ads
   *
   * In order to execute ads in Google Ads, you need to register keywords.
   * A keyword must be registered to target the end users of the ad, and it is one of the `adGroupCriteria` mapped to `adGroup` among the resources of Google Ads.
   * This connector is a function to recommend such keywords, and when the user enters the keywords that he or she wanted to register, it recommends other keywords that can be derived from them.
   *
   * The request result is a list of keywords, the competition index, unit price, and the expected index values when registering an ad for each keyword.
   *
   * This connector excludes keywords for adult ads, and the language condition is set to Korean and the geographical condition is set to Korea (South Korea).
   *
   * Before calling the function, you need to ask the user for `customerId`, so you need to suggest a connector that can check `customerId`.
   */
  async getKeywordRecommendations(
    input: IGoogleAdsService.IGenerateKeywordIdeaByKeywordsInput,
  ): Promise<IGoogleAdsService.IGenerateKeywordIdeaOutput> {
    const customerId = await this.getTargetCustomerId({});

    return await this.generateKeywordIdeas({
      ...input,
      customerId,
    });
  }

  /**
   * Google Ads Service.
   *
   * Get keyword recommendations for Google Ads
   *
   * In order to execute ads in Google Ads, you need to register keywords.
   * A keyword must be registered to target the end users of the ad, and it is one of the `adGroupCriteria` mapped to `adGroup` among the resources of Google Ads.
   * This connector is a function to recommend such keywords, and when the user enters the URL that he or she wanted to register, it recommends other keywords that can be derived from it.
   *
   * The request result is a list of keywords, competition index, unit price, and expected index values for each keyword when registering an ad.
   *
   * This connector excludes keywords for adult ads, and the language condition is set to Korean and the geographical condition is set to Korea (South Korea).
   *
   * Before calling the function, you need to ask the user for `customerId`, so you need to suggest a connector that can check `customerId`.
   */
  async getUrl(
    input: IGoogleAdsService.IGenerateKeywordIdeaByURLInput,
  ): Promise<IGoogleAdsService.IGenerateKeywordIdeaOutput> {
    const customerId = await this.getTargetCustomerId({});

    return await this.generateKeywordIdeas({
      ...input,
      customerId,
    });
  }

  private async generateKeywordIdeas(
    input:
      | IGoogleAdsService.IGenerateKeywordIdeaByURLInput
      | IGoogleAdsService.IGenerateKeywordIdeaByKeywordsInput
      | IGoogleAdsService.IGenerateKeywordIdeaByKeywordsAndUrlInput,
  ): Promise<IGoogleAdsService.IGenerateKeywordIdeaOutput> {
    const customerId = await this.getTargetCustomerId(input);

    try {
      const headers = await this.getHeaders();
      const endPoint = `${this.baseUrl}/customers/${customerId}:generateKeywordIdeas`;

      const res = await axios.post(
        endPoint,
        {
          ...this.getGenerateKeywordSeed(input),
          includeAdultKeywords: false, // 성인 키워드 제외
          language: "languageConstants/1012" as const, // 한국어를 의미
          geoTargetConstants: ["geoTargetConstants/2410"], // 대한민국이라는 지리적 제한을 의미

          ...(input.pageSize && { pageSize: input.pageSize }),
          ...(input.pageToken && { pageToken: input.pageToken }),
        },
        {
          headers,
        },
      );
      return res.data;
    } catch (err) {
      console.error(
        JSON.stringify(err instanceof AxiosError ? err.response?.data : err),
      );
      throw err;
    }
  }

  /**
   * Google Ads Service.
   *
   * View ad details
   *
   * Depending on the campaign, it is either a responsive search ad or a responsive display ad.
   *
   * If `customerId` is not passed, it will be automatically selected only if the user has only one ad account that `Wrtn` can access.
   *
   * Before calling the function, you should ask the user for `customerId`, so you should suggest a connector that can check `customerId`.
   *
   */
  async getAdGroupAdDetail(
    input: Omit<IGoogleAdsService.IGetAdGroupAdDetailInput, "customerId"> & {
      customerId: string;
    },
  ): Promise<IGoogleAdsService.IGetAdGroupAdDetailOutput> {
    const customerId = await this.getTargetCustomerId(input);

    const query = `
    SELECT
      ad_group_ad.resource_name,
      ad_group_ad.ad.resource_name,
      ad_group_ad.status,
      ad_group_ad.ad.responsive_search_ad.descriptions,
      ad_group_ad.ad.responsive_search_ad.headlines,
      ad_group_ad.ad.responsive_display_ad.headlines,
      ad_group_ad.ad.responsive_display_ad.long_headline,
      ad_group_ad.ad.responsive_display_ad.business_name,
      ad_group_ad.ad.responsive_display_ad.descriptions,
      ad_group_ad.ad.responsive_display_ad.marketing_images,
      ad_group_ad.ad.responsive_display_ad.square_marketing_images,
      ad_group_ad.ad.responsive_display_ad.square_logo_images
    FROM ad_group_ad
    WHERE ad_group_ad.resource_name = '${input.adGroupAdResourceName}'` as const;

    const res = await this.searchStream(customerId, query);
    const adGroupAd = res.results[0]!.adGroupAd;

    const detail =
      adGroupAd.ad.responsiveSearchAd || adGroupAd.ad.responsiveDisplayAd;

    return {
      resourceName: adGroupAd.resourceName,
      status: adGroupAd.status,
      ad: { resourceName: adGroupAd.ad.resourceName, detail },
    };
  }

  /**
   * Google Ads Service.
   *
   * Changes the ad status of a Google customer account.
   *
   * Updates ad status using `customerId` and `adGroupAdResourceName`.
   * If `customerId` is not provided, it auto-selects if Wrtn has access to only one account.
   * Supports `ENABLED` (active) and `PAUSED` (suspended) statuses.
   *
   * Wrtn changes only the ad status, not the campaign or ad group.
   * Users should manually update campaign/ad group statuses in the Google Ads dashboard.
   * To pause an ad group or campaign, update all ads within them.
   *
   * Ads cannot be deleted via this connector. Instead, pause all child ads.
   * Deleting ads removes performance data, so pausing is recommended for future use.
   *
   * Before calling, prompt the user to check `customerId` using a relevant connector.
   */
  async updateAd(input: IGoogleAdsService.ISetOnOffInput) {
    try {
      const customerId = await this.getTargetCustomerId(input);

      const headers = await this.getHeaders();
      const url = `${this.baseUrl}/customers/${customerId}/adGroupAds:mutate`;

      await axios.post(
        url,
        {
          operations: {
            update_mask: "status",
            update: {
              status: input.status,
              resource_name: input.adGroupAdResourceName,
            },
          },
        },
        {
          headers,
        },
      );
    } catch (err) {
      console.error(
        JSON.stringify(err instanceof AxiosError ? err.response?.data : err),
      );
      throw err;
    }
  }

  /**
   * Google Ads Service.
   *
   * Creates Search Ads in Google customer accounts at once.
   *
   * This process includes creating campaigns, ad groups, and ads in a single step.
   * No need to specify a campaign, as everything is generated from the top-level campaign node.
   * Campaigns manage budgets, and ads optimize performance within them.
   *
   * This method is convenient for executing ads but may not suit cases requiring multiple ad variations.
   * If `customerId` is not provided, it auto-selects if Wrtn has access to only one account.
   *
   * Ads are initially set to `PAUSED` for user review, ensuring no unintended expenses.
   * Once verified, users can enable ads via the `Ad Edit Connector`.
   *
   * There is a spending limit of 100,000 KRW per campaign for emergencies.
   * Before calling, prompt the user to check `customerId` using a relevant connector.
   */
  async createSearchAd(
    input: IGoogleAdsService.ICreateAdGroupSearchAdAtOnceInput,
  ) {
    const customerId = await this.getTargetCustomerId({});

    const { campaign, campaignBudget } = await this.createCampaign({
      ...input.campaign,
      advertisingChannelType: "SEARCH",
      customerId,
    });

    const ad = await this.createAd({
      ...input.ad,
      campaignResourceName: campaign.resourceName,
      customerId,
      type: "SEARCH_STANDARD",
    });

    return {
      campaign,
      campaignBudget,
      ad,
    };
  }

  /**
   * Google Ads Service.
   *
   * Creates Display Ads in a Google customer account at once.
   *
   * This includes campaigns, ad groups, and ads in one step.
   * No need to specify a campaign, as the entire structure is created together.
   * Campaigns manage budgets, while ads optimize exposure dynamically.
   *
   * This method is convenient but may not suit cases requiring multiple ad variations.
   * If `customerId` is not provided, it auto-selects if Wrtn has access to only one account.
   *
   * Ads are initially set to `PAUSED` for user review, ensuring no unintended expenses.
   * Once reviewed, users can enable ads via the `Ad Edit Connector`.
   *
   * Ads undergo immediate review, and upon approval, they are ready for activation.
   * Spending is limited to 100,000 KRW per campaign for emergencies.
   * Before calling, prompt the user to check `customerId` using a relevant connector.
   */
  async createDisplayAd(
    input: IGoogleAdsService.ICreateAdGroupDisplayAdAtOnceInput,
  ) {
    const customerId = await this.getTargetCustomerId({});

    const { campaign, campaignBudget } = await this.createCampaign({
      ...input.campaign,
      advertisingChannelType: "DISPLAY",
      customerId,
    });

    const ad = await this.createAd({
      ...input.ad,
      campaignResourceName: campaign.resourceName,
      customerId,
      type: "DISPLAY_STANDARD",
    });

    return {
      campaign,
      campaignBudget,
      ad,
    };
  }

  /**
   * Google Ads Service.
   *
   * Creates an ad for a Google customer account.
   *
   * `Wrtn` creates one ad per ad group for convenience.
   * The ad group is created automatically, so no `adGroup` ID is required.
   * Ad types depend on the campaign (e.g., search ads require a search campaign).
   *
   * If `customerId` is not provided, Wrtn selects an accessible account automatically.
   *
   * Ads enter Google's review process immediately after creation.
   * However, they are initially set to `PAUSED` for user verification, preventing unintended expenses.
   * Once confirmed, users can enable ads via the `ad edit connector`.
   *
   * Before calling, prompt the user to check `customerId` using a relevant connector.
   */
  async createAd(
    input: Omit<
      IGoogleAdsService.ICreateAdGroupAdInputCommon,
      "campaignResourceName"
    > & {
      campaignResourceName: string;
    },
  ): Promise<IGoogleAdsService.IGetAdGroupsOutputResult> {
    const customerId = await this.getTargetCustomerId(input);

    try {
      const adGroupResourceName = await this.createAdGroup(input);
      const headers = await this.getHeaders();
      const url = `${this.baseUrl}/customers/${customerId}/adGroupAds:mutate`;
      if (input.keywords.length) {
        await this.createAdGroupCriteria({
          adGroupResourceName,
          ...input,
        }); // Google Ads Keywords 생성
      }

      if (input.type === "SEARCH_STANDARD") {
        await axios.post(
          url,
          {
            operations: {
              create: {
                status: "PAUSED",
                ad: {
                  final_urls: [input.finalUrl],
                  responsive_search_ad: {
                    headlines: input.headlines.map((text) => ({ text })),
                    descriptions: input.descriptions.map((text) => ({ text })),
                  },
                },
                ad_group: adGroupResourceName,
              },
            },
          },
          {
            headers,
          },
        );
      } else {
        const asserted =
          typia.assert<IGoogleAdsService.ICreateAdGroupDisplayAdInput>(input);
        /**
         * DISPLAY_STANDARD
         */
        await axios.post(
          url,
          {
            operations: {
              create: {
                status: "PAUSED",
                ad: {
                  final_urls: [asserted.finalUrl],
                  responsive_display_ad: {
                    headlines: asserted.headlines.map((text) => ({ text })),
                    long_headline: { text: asserted.longHeadline },
                    descriptions: asserted.descriptions.map((text) => ({
                      text,
                    })),
                    marketing_images: await this.createAssets({
                      cusotmerId: asserted.customerId,
                      images: await Promise.all(
                        asserted.landscapeImages.map((el) =>
                          this.cropImage(el, 1.91),
                        ),
                      ),
                    }),
                    square_marketing_images: await this.createAssets({
                      cusotmerId: asserted.customerId,
                      images: await Promise.all(
                        asserted.squareImages.map((el) =>
                          this.cropImage(el, 1),
                        ),
                      ),
                    }),
                    business_name: asserted.businessName,
                    youtube_videos: [],
                    square_logo_images: await this.createAssets({
                      cusotmerId: asserted.customerId,
                      images: await Promise.all(
                        asserted.logoImages.map((el) => this.cropImage(el, 1)),
                      ),
                    }),
                  },
                },
                ad_group: adGroupResourceName,
              },
            },
          },
          {
            headers,
          },
        );
      }

      const [result] = await this.getAdGroupDetails({
        ...input,
        adGroupResourceName,
      });
      return result!;
    } catch (err) {
      /**
       * @todo 광고 삭제 기능 추가
       */
      console.error(
        JSON.stringify(err instanceof AxiosError ? err.response?.data : err),
      );
      throw err;
    }
  }

  /**
   * Google Ads Service.
   *
   * Edits an ad campaign for a Google customer account.
   *
   * You can edit the campaign name, budget, and end date.
   * The campaign name is for recognition and doesn't affect the ad.
   * The budget is entered in Korean Won (KRW), with daily spending fluctuating above or below the set budget.
   * The end date can be used as a scheduled end date; if not specified, the ad continues to run.
   * If the end date is already set, it must be updated to ensure the ad is executed.
   *
   * If `customerId` is not provided, Wrtn auto-selects an accessible account.
   *
   * Before calling, prompt the user to check `customerId` using a relevant connector.
   *
   * A 100,000 KRW limit per campaign is currently set for emergency purposes.
   */
  async updateCampaign(
    input: IGoogleAdsService.IUpdateCampaignInput & {
      customerId: string;
    },
  ): Promise<void> {
    const customerId = await this.getTargetCustomerId(input);

    try {
      const { campaignResourceName, campaignBudget, ...rest } = input;
      const url = `${this.baseUrl}/customers/${customerId}/campaigns:mutate`;
      const headers = await this.getHeaders();

      const [campaign] = await this.getCampaigns(input);

      if (campaignBudget) {
        await this.updateCampaignBudget(
          customerId,
          campaign!.campaignBudget.resourceName,
          campaignBudget,
        );
      }

      if (JSON.stringify(rest) != "{}") {
        await axios.post(
          url,
          {
            operations: {
              update: {
                resource_name: campaignResourceName,
                ...(input.campaignName && { name: input.campaignName }),
                ...(input.endDate && { end_date: input.endDate }),
              },
              update_mask: Object.keys(rest).join(","),
            },
          },
          {
            headers,
          },
        );
      }
    } catch (err) {
      console.error(
        JSON.stringify(err instanceof AxiosError ? err.response?.data : err),
      );
      throw err;
    }
  }

  /**
   * Google Ads Service.
   *
   * Creates an ad campaign for a Google customer account.
   *
   * A campaign is the top-level object in Google Ads, grouping ad groups and ads.
   * It manages the ad's duration, budget, purpose, and channel.
   * If no campaign name is provided, a random name is assigned, which may be hard to identify.
   * It’s recommended to give meaningful names to campaigns, but the name does not affect ad effectiveness.
   *
   * If `customerId` is not passed, Wrtn will auto-select an accessible account.
   *
   * Before calling, prompt the user to check `customerId` using a relevant connector.
   *
   * A 100,000 KRW limit per campaign is set for emergency purposes.
   */
  async createCampaign(
    input: IGoogleAdsService.ICreateCampaignInput & {
      customerId: string;
    },
  ): Promise<IGoogleAdsService.ICreateCampaignsOutput> {
    const customerId = await this.getTargetCustomerId(input);

    try {
      const url = `${this.baseUrl}/customers/${customerId}/campaigns:mutate`;
      const headers = await this.getHeaders();
      const campaignBudgetResourceName = await this.createCampaignBudget(input);
      const res = await axios.post(
        url,
        {
          operations: [
            {
              create: {
                name: input.campaignName ?? randomUUID(),
                advertising_channel_type: input.advertisingChannelType,
                status: "ENABLED",
                campaignBudget: campaignBudgetResourceName,

                /**
                 * @todo 유저의 요구사항에 맞는 광고 효율 최적화를 진행해야 한다.
                 */
                target_spend: {},
                ...(input.startDate && { start_date: input.startDate }),
                ...(input.endDate && { end_date: input.endDate }),
              },
            },
          ],
        },
        {
          headers,
        },
      );

      const createdResourceName = res.data.results[0].resourceName;
      const [campaign] = await this.getCampaigns({
        ...input,
        resourceName: createdResourceName,
      });
      return campaign!;
    } catch (err) {
      console.error(
        JSON.stringify(err instanceof AxiosError ? err.response?.data : err),
      );
      throw err;
    }
  }

  /**
   * Google Ads Service.
   *
   * Get ad groups from Google customer account
   *
   * Pass `customerId` to the user and search for ad groups (=adGroup) in the customer ad account.
   * If `customerId` is not passed, it will automatically select only one ad account that `Wrtn` can access from the user.
   * If `campaignId` is also passed, it will search only the child ad groups of the campaign.
   * Ad groups are the area in charge of targeting and are also the parents of ads (ads).
   *
   * @param input
   * @returns
   */
  async getAdGroups(
    input: Omit<IGoogleAdsService.IGetAdGroupInput, "customerId"> & {
      customerId: string;
    },
  ): Promise<IGoogleAdsService.IGetGoogleAdGroupOutput> {
    try {
      const query = `
      SELECT 
        campaign.id,
        campaign.resource_name,
        campaign.status,
        ad_group.id,
        ad_group.resource_name,
        ad_group.name,
        ad_group.type
      FROM ad_group
      WHERE
        campaign.status != 'REMOVED'
          AND ad_group.status != 'REMOVED'
            ${input.campaignId ? `AND campaign.id = '${input.campaignId}'` : ""}
            ${input.adGroupResourceName ? `AND ad_group.resource_name = '${input.adGroupResourceName}'` : ""}` as const;

      const adGroup = await this.searchStream(input.customerId, query);
      return adGroup;
    } catch (err) {
      console.error(
        JSON.stringify(err instanceof AxiosError ? err.response?.data : err),
      );
      throw err;
    }
  }

  /**
   * Google Ads Service.
   *
   * Delete keywords from specific ads in Google customer account
   *
   * Receive the resource name of keyword (=`AdGroupCriterion`) from the user and delete all of them.
   * Keywords are `AdGroupCriterion` whose `type` is `KEYWORD`, so you should be careful because there may be other types of resources.
   * If all keywords are deleted in an ad, you should be careful because deleting keywords may affect ad execution, etc.
   *
   * In addition, if you delete keywords from an ad, other ads that share the ad group that is the parent of the ad may also be affected.
   *
   * If `customerId` is not passed, `Wrtn` will automatically select only one ad account that the user can access.
   *
   * Before calling the function, you should ask the user for `customerId`, so you should suggest a connector that can check `customerId`.
   *
   */
  async deleteKeywords(
    input: IGoogleAdsService.IDeleteAdGroupCriteriaInput,
  ): Promise<void> {
    try {
      const customerId = await this.getTargetCustomerId(input);

      const url = `${this.baseUrl}/customers/${customerId}/adGroupCriteria:mutate`;
      const headers = await this.getHeaders();
      await axios.post(
        url,
        {
          operations: input.resourceNames.map((resourceName) => ({
            remove: resourceName,
          })),
        },
        {
          headers,
        },
      );
    } catch (err) {
      console.error(
        JSON.stringify(err instanceof AxiosError ? err.response?.data : err),
      );
      throw err;
    }
  }

  /**
   * Google Ads Service.
   *
   * Adds search keywords to ads in Google customer accounts.
   *
   * This connector adds keywords to ad groups by first finding the parent ad group of the ad using its resource name.
   * The result helps users check if all keywords are added correctly.
   * Not all keywords will be used in ads as they undergo Google’s review, and inappropriate keywords may be excluded.
   * It’s beneficial to register a variety of keywords to attract users.
   *
   * Recommended connectors for keyword management are also available.
   *
   * The connector accepts an ad account for authentication, but this is optional.
   * If `customerId` is not provided, Wrtn auto-selects an accessible ad account.
   *
   * Before calling, prompt the user to check `customerId` using a relevant connector.
   */
  async getKeywords(input: {
    customerId: string;
    adGroupResourceName: string;
  }): Promise<IGoogleAdsService.IGetKeywordsOutput> {
    const customerId = await this.getTargetCustomerId(input);

    const query = `
    SELECT
      ad_group_criterion.criterion_id,
      ad_group_criterion.resource_name,
      ad_group_criterion.type,
      ad_group_criterion.keyword.text,
      ad_group_criterion.keyword.match_type,
      ad_group_criterion.status
    FROM ad_group_criterion
      WHERE ad_group_criterion.type = "KEYWORD" AND ad_group.resource_name = '${input.adGroupResourceName}' AND ad_group_criterion.status != "REMOVED"` as const;

    const keywords = await this.searchStream(customerId, query);
    return keywords.results.map((el) => {
      return {
        ...el,
        adGroupCriterion: {
          ...el.adGroupCriterion,
          ...el.adGroupCriterion.keyword,
        },
      };
    });
  }

  /**
   * Google Ads Service.
   *
   * View metrics per Google customer account ad.
   *
   * Pass `customerId` to view statistical metrics for the customer ad group. If `customerId` is not provided, Wrtn auto-selects an accessible ad account.
   * Metrics include impressions, clicks, video views, views based on video playback range, average page count, and the resource name of the ad group.
   * Additionally, `costMicros` shows advertising expenditure in micro-units, e.g., if `1,000,000` KRW, it means 1 won spent.
   * This value reflects actual spending and may slightly exceed the campaign budget, as per Google policy.
   * The total spend of an ad group must match the total spend of the campaign.
   *
   * This connector helps users assess ad performance and efficiency in terms of cost and results.
   * Before calling, prompt the user to check `customerId` using a relevant connector.
   */
  async getMetrics(input: Required<IGoogleAdsService.IGetMetricInput>) {
    const customerId = await this.getTargetCustomerId(input);

    const query = `
    SELECT
      metrics.average_page_views, 
      metrics.impressions, 
      metrics.clicks, 
      metrics.cost_micros, 
      metrics.video_views, 
      metrics.video_quartile_p25_rate, 
      metrics.video_quartile_p50_rate, 
      metrics.video_quartile_p75_rate, 
      metrics.video_quartile_p100_rate,
      ad_group_ad.resource_name
    FROM 
      ad_group_ad
    WHERE
      segments.date = '${input.date}'` as const;

    const response = await this.searchStream(customerId, query);
    return response.results;
  }

  /**
   * Google Ads Service.
   *
   * Get the list of ads from the Google customer account.
   *
   * Pass `customerId` to search for ads in the customer's ad account. If `customerId` is not provided, Wrtn auto-selects an accessible ad account.
   * Ads are the final node in the tree structure consisting of campaigns, ad groups, and ads, responsible for materials and exposure to users.
   * If the resource name of an ad group is provided, only ads within that ad group will be searched.
   * The purpose of this connector is to check if the user's ad is running. Ads are generally `ENABLED` when running and `PAUSED` when stopped.
   * Wrtn does not change campaign or ad group status, only the user can modify these statuses.
   * The connector also checks ad execution and policy compliance, with `PolicySummary` showing approval status.
   * If the ad is approved, it is eligible for display.
   * Ad status can be updated via `PATCH connector/google-ads/campaigns/ads/status`.
   * Before calling, ask the user for `customerId` and suggest a connector to check it.
   */
  async getAdGroupAds(input: {
    customerId: string;
    adGroupResourceName?: string;
  }): Promise<IGoogleAdsService.IGetAdGroupAdOutput> {
    const customerId = await this.getTargetCustomerId(input);

    const query = `
    SELECT
      ad_group_ad.resource_name,
      ad_group_ad.status,
      ad_group_ad.policy_summary.approval_status,
      ad_group_ad.policy_summary.review_status
    FROM ad_group_ad 
    WHERE 
      ad_group.status != 'REMOVED'
      ${input.adGroupResourceName ? `AND ad_group_ad.ad_group = '${input.adGroupResourceName}'` : ""}
    ` as const;

    const response = await this.searchStream(customerId, query);

    return response.results.map((el) => el.adGroupAd);
  }

  /**
   * Google Ads Service.
   *
   * Get a list of ad groups in a Google customer account
   *
   * Pass `customerId` to the user and search for ad groups (=adGroup) in the customer ad account.
   * If `customerId` is not passed, it will automatically select only one ad account that `Wrtn` can access from the user.
   * If `campaignId` is also passed, it will search only the child ad groups of the campaign.
   * Ad groups are the area in charge of targeting and are also the parents of ads (ads).
   * The result of this connector contains simple information about the campaign that is the parent of the ad group, information about the ad group,
   * a list of ads belonging to the ad group, their current status, and simple information.
   * It also contains information about keywords connected to the ad group.
   *
   * Before calling the function, you should ask the user for `customerId`, so you should suggest a connector that can check `customerId`.
   *
   * @todo 광고 그룹마다 키워드가 보여지게 수정해야 한다.
   */
  async getAdGroupDetails(
    input: Omit<IGoogleAdsService.IGetAdGroupInput, "customerId"> & {
      customerId: string;
    },
  ): Promise<IGoogleAdsService.IGetAdGroupOutput> {
    try {
      const customerId = await this.getTargetCustomerId(input);

      const adGroupsResult = await this.getAdGroups({
        ...input,
        customerId,
      });

      const response = [];
      for await (const { campaign, adGroup } of adGroupsResult.results) {
        const adGroupResourceName = adGroup.resourceName;
        const adGroupAds = await this.getAdGroupAds({
          ...input,
          adGroupResourceName,
        });

        const adGroupCriterions = await this.getKeywords({
          customerId,
          adGroupResourceName,
        });

        response.push({
          campaign,
          adGroup,
          adGroupAds,
          keywords: (adGroupCriterions ?? []).map((result) => ({
            criterionId: result.adGroupCriterion.criterionId,
            resourceName: result.adGroupCriterion.resourceName,
            ...result.adGroupCriterion.keyword,
          })),
        });
      }

      return response;
    } catch (err) {
      console.error(
        JSON.stringify(err instanceof AxiosError ? err.response?.data : err),
      );
      throw err;
    }
  }

  /**
   * Google Ads Service.
   *
   * Add search keywords to ads in Google customer accounts
   *
   * Strictly speaking, add keywords to the ad group (=adGroup), which is the parent of the ad.
   * Since keywords are added to ad groups, they are applied to all child ads.
   *
   * If `customerId` is not passed, it is automatically selected only if there is only one ad account accessible to `Wrtn` from the user.
   *
   * Before calling the function, you should ask the user for `customerId`, so you should suggest a connector that can check `customerId`.
   *
   */
  async createAdGroupCriteria(
    input: IGoogleAdsService.ICreateKeywordInput & {
      adGroupResourceName: IGoogleAdsService.IAdGroup["resourceName"];
    },
  ): Promise<IGoogleAdsService.ICreateAdGroupCriteriaOutput> {
    try {
      const customerId = await this.getTargetCustomerId(input);

      const url = `${this.baseUrl}/customers/${customerId}/adGroupCriteria:mutate`;
      const headers = await this.getHeaders();
      const res = await axios.post(
        url,
        {
          operations: input.keywords.map((keyword) => {
            return {
              create: {
                type: "KEYWORD",
                status: "ENABLED",
                ad_group: input.adGroupResourceName,
                keyword: {
                  text: keyword,
                  match_type: "BROAD",
                },
              },
            };
          }),
        },
        {
          headers,
        },
      );

      return (
        res.data.results.map(
          (el: Pick<IGoogleAdsService.AdGroupCriterion, "resourceName">) =>
            el.resourceName,
        ) ?? []
      );
    } catch (err) {
      console.error(
        JSON.stringify(err instanceof AxiosError ? err.response?.data : err),
      );
      throw err;
    }
  }

  /**
   * Google Ads Service.
   *
   * Get a list of campaigns for a Google customer account
   *
   * Pass `customerId` to the user and search for campaigns in the customer's advertising account.
   * If `customerId` is not passed, `Wrtn` will automatically select only one advertising account that the user can access.
   * A campaign corresponds to `campaign` among Google resources and is in charge of advertising channels, budgets, and the start and end dates of advertising execution.
   * A channel refers to Google advertising products such as responsive search ads (=responsive search ads) and responsive display ads (=responsive display ads).
   * If a campaign is a search ad, there are only search ads in the ad group and ads.
   * A user can use this connector to search for their campaigns and the status of the campaigns, and create ad groups for the desired campaigns, etc., for subsequent actions.
   *
   * Before calling the function, you should ask the user for `customerId`, so you should suggest a connector that can check `customerId`.
   *
   */
  async getCampaigns(
    input: IGoogleAdsService.IGetCampaignsInput,
  ): Promise<IGoogleAdsService.IGetCampaignsOutput> {
    const customerId = await this.getTargetCustomerId(input);

    try {
      const query = `SELECT 
          campaign.resource_name,
          campaign.id,
          campaign.name,
          campaign.status,
          campaign.optimization_score,
          campaign.advertising_channel_type,
          campaign.start_date,
          campaign.end_date,
          campaign_budget.resource_name,
          campaign_budget.amount_micros
        FROM campaign
          WHERE campaign.status != 'REMOVED' ${input.resourceName ? ` AND campaign.resource_name = "${input.resourceName}"` : ""}` as const;

      const res = await this.searchStream(customerId, query);
      return res.results ?? [];
    } catch (err) {
      console.error(
        JSON.stringify(err instanceof AxiosError ? err.response?.data : err),
      );
      throw err;
    }
  }

  /**
   * Google Ads Service.
   *
   * Get the customer's advertising account.
   *
   * Using the user's access token, search for the user's advertising account (`customer`) among the accounts where Wrtn is an administrator.
   * If Wrtn is not an administrator for an account, it will not be listed. In such cases, call `POST connector/google-ads/customerClientLink`.
   * This connector filters out accounts that do not use the Korean currency unit `KRW` to avoid errors in future budget modifications or ad status changes.
   * If an account with a different currency (e.g., USD) is used, budget discrepancies may occur due to exchange rates.
   * Before calling the function, ask the user for their `customerId` and suggest a connector to check it.
   */
  async getCustomers(): Promise<IGoogleAdsService.ICustomerClient[]> {
    try {
      const customers = await this.listAccessibleCustomers();

      /**
       * Wrtn에 등록된 클라이언트 중 customers에 포함된 것만 남겨야 한다.
       */
      const customerClients = await this.getCustomerClient();
      const res = customerClients.results
        .filter((el) => el.customerClient.currencyCode === "KRW") // 한국 돈으로 광고하는 경우만 허용한다.
        .filter((el) =>
          customers.resourceNames
            .map((name) => TypedSplit(name, "customers/")[1])
            .some((id) => id === el.customerClient.id),
        );

      return res.map((el) => el.customerClient);
    } catch (err) {
      console.error(
        JSON.stringify(err instanceof AxiosError ? err.response?.data : err),
      );
      throw err;
    }
  }

  /**
   * Google Ads Service.
   *
   * Create a sub-account.
   *
   * @deprecated
   * @param descriptive_name A unique name for the customer (Google may not be unique.)
   * @returns
   */
  async createAccount(input: { descriptive_name: string }) {
    const headers = await this.getHeaders();
    const parentId = this.props.googleAds.accountId;
    const endPoint = `${this.baseUrl}/customers/${parentId}/:createCustomerClient`;
    const res = await axios.post(
      endPoint,
      {
        customer_id: parentId,
        customer_client: {
          /**
           * @todo 유저에게 맵핑할 수 있는 유니크한 이름 정하기
           */
          descriptive_name: input.descriptive_name,
          currency_code: "KRW",
          time_zone: "Asia/Seoul",
        },
      },
      {
        headers,
      },
    );

    return res.data;
  }

  /**
   * Google Ads Service.
   *
   * Function that identifies the number of customers or inquires about the resource name of the customer.
   */
  async getCustomerClient() {
    const res = await this.searchStream(
      this.props.googleAds.accountId,
      `SELECT customer_client.resource_name, customer_client.id, customer_client.descriptive_name, customer_client.currency_code FROM customer_client`,
    );

    return res;
  }

  /**
   * Google Ads Service.
   *
   * Create a campaign budget.
   *
   * @param input
   * @returns
   */
  private async createCampaignBudget(
    input: IGoogleAdsService.ICreateCampaignBudgetInput,
  ): Promise<IGoogleAdsService.CampaignBudget["resourceName"]> {
    try {
      const headers = await this.getHeaders();
      const url = `${this.baseUrl}/customers/${input.customerId}/campaignBudgets:mutate`;
      const res = await axios.post(
        url,
        {
          operations: [
            {
              create: {
                amountMicros: 1000000 * input.campaignBudget,
                explicitlyShared: false, // 이 예산을 공유하는 캠페인이 존재해서는 안 된다. 캠페인과 캠페인 예산은 반드시 1:1이어야 한다.
              },
            },
          ],
        },
        {
          headers,
        },
      );

      return res.data.results[0].resourceName;
    } catch (err) {
      console.error(
        JSON.stringify(err instanceof AxiosError ? err.response?.data : err),
      );
      throw err;
    }
  }

  private async createAdGroup(
    input: Omit<
      IGoogleAdsService.ICreateAdGroupInput,
      "campaignResourceName"
    > & {
      campaignResourceName: string;
    },
  ): Promise<IGoogleAdsService.IAdGroup["resourceName"]> {
    try {
      const url = `${this.baseUrl}/customers/${input.customerId}/adGroups:mutate`;
      const headers = await this.getHeaders();
      const res = await axios.post(
        url,
        {
          operations: {
            create: {
              name: `${input.type}_${new Date().getTime()}`,
              status: "ENABLED",
              campaign: input.campaignResourceName,
              type: input.type,
            },
          },
        },
        {
          headers,
        },
      );

      return res.data.results[0].resourceName;
    } catch (err) {
      /**
       * @todo 광고 그룹 삭제 기능 추가
       */
      console.error(
        JSON.stringify(err instanceof AxiosError ? err.response?.data : err),
      );
      throw err;
    }
  }

  private async cropImage(
    image: string &
      typia.tags.Format<"uri"> &
      typia.tags.ContentMediaType<"image/*">,
    ratio: 1 | 1.91 | 0.8,
  ): Promise<string> {
    const imageFile = await getCroppedImage({
      imageUrl: image,
      ratio,
    });

    return imageFile.base64Image;
  }

  private async updateCampaignBudget(
    customerId: IGoogleAdsService.ICustomerClient["id"],
    campaignBudgetResourceName: IGoogleAdsService.CampaignBudget["resourceName"],
    campaignBudget: number, // 한국 돈 단위
  ) {
    try {
      const url = `${this.baseUrl}/customers/${customerId}/campaignBudgets:mutate`;
      const headers = await this.getHeaders();

      await axios.post(
        url,
        {
          operations: {
            update_mask: "amount_micros",
            update: {
              resource_name: campaignBudgetResourceName,
              amount_micros: campaignBudget * 1000000,
            },
          },
        },
        { headers },
      );
    } catch (err) {
      console.error(
        JSON.stringify(err instanceof AxiosError ? err.response?.data : err),
      );
      throw err;
    }
  }

  private getGenerateKeywordSeed(
    input:
      | IGoogleAdsService.IGenerateKeywordIdeaByURLInput
      | IGoogleAdsService.IGenerateKeywordIdeaByKeywordsInput
      | IGoogleAdsService.IGenerateKeywordIdeaByKeywordsAndUrlInput,
  ):
    | { keywordAndUrlSeed: { url: string; keywords: string[] } }
    | { urlSeed: { url: string } }
    | { keywordSeed: { keywords: string[] } } {
    if (
      typia.is<IGoogleAdsService.IGenerateKeywordIdeaByKeywordsAndUrlInput>(
        input,
      )
    ) {
      return {
        keywordAndUrlSeed: {
          url: input.url,
          keywords: input.keywords,
        },
      };
    } else if (
      typia.is<IGoogleAdsService.IGenerateKeywordIdeaByURLInput>(input)
    ) {
      return {
        urlSeed: {
          url: input.url,
        },
      };
    } else {
      return {
        keywordSeed: {
          keywords: input.keywords,
        },
      };
    }
  }

  private async createAssets(input: {
    cusotmerId: string;
    images: string[]; // base64 encoded images
  }): Promise<{ asset: string }[]> {
    try {
      const url = `${this.baseUrl}/customers/${input.cusotmerId}/assets:mutate`;
      const headers = await this.getHeaders();
      const res = await axios.post(
        url,
        {
          operations: input.images.map((image) => {
            return {
              create: {
                name: v4(),
                type: "IMAGE",
                image_asset: {
                  data: image,
                },
              },
            };
          }),
        },
        {
          headers,
        },
      );

      return (
        res.data.results.map((el: { resourceName: string }) => ({
          asset: el.resourceName,
        })) ?? []
      );
    } catch (err) {
      console.error(
        JSON.stringify(err instanceof AxiosError ? err.response?.data : err),
      );
      throw err;
    }
  }

  /**
   * Create Google Ads Client Link.
   *
   * Google Ads can only be called if it is an account delegated to us, even if the user's token has scope.
   * This API issues an invitation to the user, whether to grant administrator rights to Us.
   *
   * @param input
   * @param validateOnly
   * @returns
   */
  private async createClientLink(input: {
    resourceName: IGoogleAdsService.ICustomer["resourceName"];
  }): Promise<void> {
    try {
      const parentId = this.props.googleAds.accountId;
      const url = `${this.baseUrl}/customers/${parentId}/customerClientLinks:mutate`;
      const headers = await this.getHeaders();
      await axios.post(
        url,
        {
          operation: {
            create: {
              clientCustomer: input.resourceName,
              status: "PENDING",
            },
          },
        },
        {
          headers,
        },
      );
    } catch (err) {
      console.error(
        JSON.stringify(err instanceof AxiosError ? err.response?.data : err),
      );
      throw err;
    }
  }

  /**
   * Look up advertising accounts belonging to Google accounts.
   *
   * @param input Customer's Secret Value
   * @returns
   */
  private async listAccessibleCustomers(): Promise<IGoogleAdsService.IGetlistAccessibleCustomersOutput> {
    const url = `${this.baseUrl}/customers:listAccessibleCustomers`;
    const developerToken = (await this.getHeaders())["developer-token"];

    const accessToken = await this.refreshAccessToken();
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "developer-token": developerToken,
      },
    });

    return res.data;
  }

  private async searchStream<T extends string>(
    customerId: string,
    query: T,
  ): Promise<{ results: Camelize<StringToDeepObject<SelectedColumns<T>>>[] }> {
    try {
      const headers = await this.getHeaders();
      const res = await axios.post(
        `${this.baseUrl}/customers/${customerId}/googleAds:search`,
        {
          query,
        },
        {
          headers,
        },
      );

      return res.data.results ? res.data : { results: [] };
    } catch (err) {
      console.error(
        JSON.stringify(err instanceof AxiosError ? err.response?.data : err),
      );
      throw err;
    }
  }

  private async getHeaders() {
    const secret = this.props.googleAds.parentSecret; // refresh token of parent account.

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret}`,
      "developer-token": this.props.googleAds.developerToken, // developer token of parent account.
      "login-customer-id": this.props.googleAds.accountId, // parent account id.
    };
  }

  /**
   * Google Auth Service.
   *
   * Request to reissue Google access token
   */
  private async refreshAccessToken(): Promise<string> {
    const client = new google.auth.OAuth2(
      this.props.google.clientId,
      this.props.google.clientSecret,
    );

    client.setCredentials({
      refresh_token: decodeURIComponent(this.props.google.refreshToken),
    });
    const { credentials } = await client.refreshAccessToken();
    const accessToken = credentials.access_token;

    if (!accessToken) {
      throw new Error("Failed to refresh access token");
    }

    return accessToken;
  }
}
