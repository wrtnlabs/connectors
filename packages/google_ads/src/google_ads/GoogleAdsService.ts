import axios, { AxiosError } from "axios";
import { randomUUID } from "crypto";
import typia from "typia";
import { v4 } from "uuid";
import { IGoogleAdsService } from "../structures/IGoogleAdsService";
import { GoogleService } from "@wrtnlabs/connector-google";
import { ImageService } from "@wrtnlabs/connector-image";
import {
  Camelize,
  SelectedColumns,
  StringToDeepObject,
  TypedSplit,
} from "@wrtnlabs/connector-shared";

export class GoogleAdsService {
  private readonly baseUrl = "https://googleads.googleapis.com/v17";

  constructor(private readonly props: IGoogleAdsService.IProps) {}

  /**
   * Get Google Ads Customer ID.
   *
   * Check that the user's secret key and the advertising account you want to use are valid.
   * If the ID of the advertising account has not been delivered, it will pass you through even if you do not select it if the length of the advertising account list is 1.
   *
   * @param input
   * @returns
   */
  private async getTargetCustomerId(
    input: IGoogleAdsService.IGetTargetCustomerIdInput,
  ): Promise<IGoogleAdsService.Customer["id"]> {
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
   * Designate Wrtn as the advertising account manager of the user
   *
   * To call the Google Ads API for a specific Google account, you must own the advertising account or be registered as an administrator.
   * This connector is a connector that sends a kind of invitation to all of the user's Google advertising accounts to register the `Wrtn` advertising account as the customer's administrator.
   * After the connector is executed, an email registered to the customer account will be sent via Gmail.
   * Those who receive the email can go to the dashboard through the email and give the `Wrtn` account administrator rights.
   * If `Wrtn` is registered as an administrator, he will be able to use other APIs created in Google Ads.
   *
   * This administrator designation must be done before calling all Google Ads connectors except for connectors that do not receive `customerId` as an argument, such as keyword recommendations.
   * However, even if this connector is called, `Wrtn` will not be designated as an administrator without the user's approval, so there is no need to worry.
   *
   * Before calling the function, we need to ask the user for his `customerId`, so we need to suggest a connector that can check `customerId`.
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
   * Recommend keywords for Google Ads
   *
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
  async generateKeywordIdeas(
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
   * Change the ad status of a Google customer account
   *
   * Change the ad status by receiving the ID of the ad account and the resource name of the ad in the ad group (=`adGroupAd```ResourceName`).
   *
   * If `customerId` is not passed, it is automatically selected only if there is only one ad account that `Wrtn` can access from the user.
   *
   * The ad status supported by this connector is `ENABLED` and `PAUSED`, which means the execution and suspension of the ad, respectively.
   * Since the `Wrtn` manager account only changes the status of the ad without changing the status of the campaign and ad group,
   * unless the user changes the status of the campaign and ad group directly in the Google Ads dashboard, the ad status means whether or not spending occurs.
   * If the user wants to change the status of the ad group, instead of changing the status of the ad group, query the ad group and change the status of all ads in the ad group.
   * If the user wants to change the status of the campaign, instead of changing the status of the campaign, query the campaign and change the status of all ads in the campaign. However, if you change the status of a campaign, you must go down the campaign and ad group in the Google Ads ad structure and terminate all ads.
   *
   * Also, our connector does not support deleting ads.
   *
   * If there is a user who wants to delete a campaign, ad group, or ad, we recommend changing all child ads of the corresponding node to the `PAUSED` status.
   *
   * Since deleting an ad means losing the means to check previous performance and indicators, it is advantageous to terminate the ad instead of deleting it for future ad re-execution.
   *
   * Before calling the function, you must ask the user for `customerId`, so you must suggest a connector that can check `customerId`.
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
   * Create an ad for a Google customer account.
   *
   * The `Wrtn` manager creates one ad per ad group for convenience.
   * Therefore, this connector does not receive the resource name or ID of the ad group (=adGroup) to create the ad, and the ad group is created first when creating the ad.
   * Since the types of ads that can be created depend on the campaign, you must create them after checking the campaign.
   * For example, search ads must be created in a search campaign.
   *
   * If `customerId` is not passed, `Wrtn` will automatically select only one ad account that the user can access.
   *
   * The ad is immediately moved to the review stage after creation, and if Google's review is passed, the ad will be executed and expenses will be incurred.
   * However, when creating an ad with this connector, the ad status is set to `PAUSED`.
   * This is to allow users to check the campaign, ad group, ad, etc. again to check if they have been created in the desired state in case of an emergency.
   * Therefore, even if the ad review is complete, the ad will not be executed, and no performance or expenses will be incurred. If the ad is checked to be correct, the user can change the ad status to `ENABLED` using the `ad edit connector`.
   *
   * Before calling the function, you should ask the user for `customerId`, so you should suggest a connector that can check `customerId`.
   *
   *
   * @todo Search Ads 분리.
   *
   *
   * If you want to create Search Ads, you must follow the following steps.
   *
   * Create search ads in Google customer accounts at once
   *
   * Creating Google ads at once means creating campaigns, ad groups, and ads that exist in the Google Ads tree structure at once.
   *
   * In this case, you do not need to specify which campaign to create ads for.
   *
   * This is because everything from the first resource, the campaign, to the ad is created at once.
   *
   * The campaign tree structure of Google Ads is such that the top campaign node is in charge of the budget, and when the ad is optimized, the ad group and ad share the budget of the campaign.
   * In simple terms, this means that the ad within the campaign learns and optimizes itself to determine which ad will be exposed to the end user.
   *
   * Therefore, it is easy to create ads in the connector structure that creates them at once, but it may not be suitable if you want to create multiple ads.
   *
   * However, if you have multiple ad materials and do not intend to create and compare multiple ads, it will be very convenient because you can easily execute the ad.
   *
   * In most cases, there is no problem creating ads in this way.
   *
   * If `customerId` is not passed, it is automatically selected only if there is only one ad account accessible to `Wrtn` from the user.
   *
   * The ad is immediately reviewed after being created, and if Google's review is passed, the ad will be executed and expenses will be incurred.
   * However, if an ad is created with this connector, the ad status is set to `PAUSED`.
   * This is to prepare for an emergency so that the user can check the campaign, ad group, ad, etc. again to see if they are in the desired state.
   * Therefore, even if the ad review is complete, the ad will not be executed and no performance or expenses will be incurred.
   *
   * If the ad is checked to be correct, the user can change the ad status to `ENABLED` using the `Ad Edit Connector`.
   *
   * Before calling the function, you should ask the user for `customerId`, so you should suggest a connector that can check `customerId`.
   *
   * Originally, there was no amount limit, but in preparation for an emergency, the function is currently limited to 100,000 won per campaign.
   *
   * @todo Display Ads 분리.
   *
   * If you want to create Display Ads, you must follow the following steps.
   *
   * Create display ads in your Google customer account at once
   *
   * Creating Google ads at once means creating campaigns, ad groups, and ads that exist in the Google Ads tree structure at once.
   *
   * In this case, you do not need to specify which campaign to create ads for.
   *
   * This is because everything from the first resource, the campaign, to the ad is created at once.
   *
   * The campaign tree structure of Google Ads is such that the top campaign node is in charge of the budget, and when the ad is optimized, the ad group and ad share the budget of the campaign.
   * In simple terms, this means that the ad within the campaign learns and optimizes itself to determine which ad will be exposed to the end user.
   *
   * Therefore, it is easy to create ads in the connector structure that creates them at once, but it may not be suitable if you want to create multiple ads.
   *
   * However, if you have multiple ad materials and do not intend to create and compare multiple ads, it will be very convenient because you can easily execute the ad.
   *
   * In most cases, there is no problem creating ads in this way.
   *
   * If `customerId` is not passed, it is automatically selected only if there is only one ad account accessible to `Wrtn` from the user.
   *
   * The ad is immediately reviewed after being created, and if Google's review is passed, the ad will be executed and expenses will be incurred.
   * However, if an ad is created with this connector, the ad status is set to `PAUSED`.
   * This is to prepare for an emergency so that the user can check the campaign, ad group, ad, etc. again to see if they are in the desired state.
   * Therefore, even if the ad review is complete, the ad will not be executed and no performance or expenses will be incurred.
   *
   * If the ad is checked to be correct, the user can change the ad status to `ENABLED` using the `Ad Edit Connector`.
   *
   * Before calling the function, you should ask the user for `customerId`, so you should suggest a connector that can check `customerId`.
   *
   * Originally, there was no amount limit, but in preparation for an emergency, the function is currently limited to 100,000 won per campaign.
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
   * Edit an ad campaign for your Google customer account
   *
   * Edit a campaign.
   * The only things you can edit in a campaign are the campaign name, budget, and end date.
   * The campaign name is a value for people to recognize and has no effect on the ad, so you can specify it as you like.
   * For the budget, you can enter the budget you want to advertise in Korean Won (KRW), and in this case, the daily ad spending will be formed above and below the budget.
   * In some cases, you may spend more than the budget, or if the ad optimization is not done, you may spend less than the budget.
   * The last end date can be used as a scheduled end date because the ad will not end and will continue to run if it is not specified.
   * However, if you do not delete the end date that you have already specified, the ad may not be executed even if you turn it on later.
   * If you want to turn on the ad for a campaign that has ended, you must also change the campaign's scheduled end date.
   *
   * If you do not pass `customerId`, it will be automatically selected only if there is only one ad account that `Wrtn` can access from the user.
   *
   * Before calling the function, we need to ask the user for `customerId`, so we need to suggest a connector that can check `customerId`.
   *
   * Originally, there is no amount limit, but in case of an emergency, we currently limit the function to 100,000 won per campaign.
   *
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
   * Create an ad campaign for your Google customer account
   *
   * Create a campaign (=campaign).
   * A campaign is located under an account in Google Ads, and is located at the top of the tree structure consisting of campaigns, ad groups, and ads.
   * A campaign is a parent object for grouping ad groups, and is responsible for the duration, budget, purpose, channel, etc. of the ad.
   * If you do not specify a campaign name, a random name will be assigned. In this case, it may be difficult to identify.
   * Therefore, it is recommended to give different names to each campaign according to its purpose so that you can distinguish them.
   * The name of the campaign is only for the user to easily identify, and does not affect the effectiveness of the ad at all, so you can rest assured.
   *
   * If you do not pass `customerId`, it will be automatically selected only if there is only one ad account accessible to `Wrtn` from the user.
   *
   * You should ask the user for `customerId` before calling the function, so you should suggest a connector that can check `customerId`.
   *
   * Originally, there was no limit on the amount, but in preparation for an emergency, the function is currently limited to 100,000 won per campaign.
   *
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
   * Add search keywords to ads in Google customer accounts
   *
   * Strictly speaking, add ad keywords to ad groups (=adGroup).
   *
   * For convenience, this connector receives the resource name of the ad, finds the parent ad group of the ad, and then inserts the keyword.
   * The result value of this connector helps users check whether all keywords have been added properly by re-checking them after adding the keyword.
   * However, not all keywords added are used in ads.
   * Keywords are reviewed by Google and used for targeting, and at this time, keywords may be excluded from ad keywords due to inappropriate reviews.
   * However, since ads will work properly if there are other keywords, it is advantageous to register various keywords so that users can be attracted.
   *
   * There are also recommended connectors for keywords.
   *
   * This connector receives an ad account as an argument from the user as authentication for the customer account, but this is also optional.
   *
   * If `customerId` is not passed, it is automatically selected only if `Wrtn` has only one ad account accessible to the user.
   *
   * Before calling the function, we need to ask the user for `customerId`, so we need to suggest a connector that can check `customerId`.
   *
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
   * View metrics per Google customer account ad
   *
   * Pass `customerId` to the user and view statistical metrics for the customer ad group.
   * If `customerId` is not passed, `Wrtn` will automatically select only one ad account that the user can access.
   * Users can view ad metrics for a specific date through this connector,
   * and these metrics include impressions, clicks, video views, views based on video playback range, and average page count.
   * You can also check simple information about the searched content, such as the resource name of the ad group.
   * In addition, `costMicros` information is provided, which is the advertising expenditure in micro units and means the amount actually executed.
   * If this figure is `1,000,000`, if the currency unit is `KRW`, 1 won was used.
   * This figure is the actual amount used, unlike the campaign budget, and according to Google policy, advertising costs may be slightly more than the budget. Also, the total spend of the ad group in the campaign must be equal to the total spend of the campaign.
   *
   * This connector allows the user to check whether their ads are being executed efficiently in terms of cost and performance.
   *
   * Before calling the function, you should ask the user for `customerId`, so you should suggest a connector that can check `customerId`.
   *
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
   * Get the list of ads from the Google customer account
   *
   * Pass the `customerId` to the user and search for the ads (=ad) in the customer's ad account.
   * If `customerId` is not passed, it will be automatically selected only if there is only one ad account accessible to `Wrtn` from the user.
   * An ad is a node at the end of a tree structure consisting of campaigns, ad groups, and ads, and is a section in charge of materials,
   * and is also a unit exposed to end users.
   * If the resource name of an ad group (=adGroup) is passed as an argument, only the ads belonging to that ad group will be searched.
   * The purpose of this connector is to determine whether the user's ad is currently running or not.
   * In the case of `Wrtn` managers, campaigns and ad groups are not changed to `PAUSED` status unless the user directly changes the campaign and ad group status in the Google Ads dashboard.
   * Therefore, in general, if the ad status is `ENABLED`, the ad is running, and if it is `PAUSED`, the ad is stopped. Again, the `Wrtn` connector does not change the status of a campaign or ad group.
   *
   * This function can also be used to check whether an ad is being properly executed in addition to viewing the ad.
   *
   * Each ad has an evaluation history for ad review and policy, which exists as a property called `PolicySummary`.
   *
   * This property contains whether the ad has been approved, and the `APPROVED` status means that Google has approved the review and determined it is eligible.
   *
   * You can change the ad status in `PATCH connector/google-ads/campaigns/ads/status`.
   *
   * Before calling the function, you should ask the user for their `customerId`, so you should suggest a connector that can check their `customerId`.
   *
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
      adGroupResourceName: IGoogleAdsService.AdGroup["resourceName"];
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
   * Get the customer's advertising account
   *
   * Using the user's access token, search for the user's advertising account, i.e., `customer`, among the accounts where `Wrtn` is an administrator.
   * Even if the user has an advertising account, if `Wrtn` is not an administrator, it will not be listed.
   * Therefore, if `Wrtn` has never been registered as an administrator, you must call the `POST connector/google-ads/customerClientLink` connector.
   *
   * In addition, this connector filters out advertising accounts that do not use the Korean currency unit `KRW`.
   * The reason for this is to prevent mistakes from occurring in other campaign budget modification or ad status change connectors in the future.
   * When creating ads through the Google Ads connector, human errors may occur in budget settings depending on the currency unit of each account.
   * For example, if you register a budget for an account with a currency unit of `USD` as an account with a currency unit of `KRW`, a budget difference of the exchange rate may occur.
   *
   * Before calling the function, we need to ask the user for his `customerId`, so we need to suggest a connector that can check `customerId`.
   *
   */
  async getCustomers(): Promise<IGoogleAdsService.CustomerClient[]> {
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
  ): Promise<IGoogleAdsService.AdGroup["resourceName"]> {
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
    const imageService = new ImageService();

    const imageFile = await imageService.getCroppedImage({
      imageUrl: image,
      ratio,
    });

    return imageFile.base64Image;
  }

  private async updateCampaignBudget(
    customerId: IGoogleAdsService.CustomerClient["id"],
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
    resourceName: IGoogleAdsService.Customer["resourceName"];
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
    const googleService = new GoogleService(this.props.google);

    const url = `${this.baseUrl}/customers:listAccessibleCustomers`;
    const developerToken = (await this.getHeaders())["developer-token"];

    const accessToken = await googleService.refreshAccessToken();
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
}
