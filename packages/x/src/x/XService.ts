import axios from "axios";
import { IXService } from "../structures/IXService";

export class XService {
  constructor(private readonly props: IXService.IProps) {}

  async getUsers(
    input: IXService.IUserInput,
  ): Promise<IXService.IUserOutput[]> {
    return this.getTweetUserInformations({ userNames: input.userNames });
  }

  async getPreDefinedInfluencers(): Promise<IXService.IUserOutput[]> {
    const influencerList: string[] = ["hwchase17", "ilyasut", "miramurati"];
    return await this.getTweetUserInformations({ userNames: influencerList });
  }

  // async prepareSummary(
  //   input: IXService.IPrePareSummarizeTweetInput,
  // ): Promise<IXService.IPrePareSummarizeTweetOutput> {
  //   try {
  //     const tweets = await this.getUserTimelineTweets(input);
  //     const txtFiles = await this.makeTxtFileForTweetAndUploadToS3(tweets);

  //     return { chatId: analyze.chatId };
  //   } catch (err) {
  //     console.error(JSON.stringify(err));
  //     throw err;
  //   }
  // }

  // async summarizeTweet(
  //   input: IXService.ISummarizeTweetInput,
  // ): Promise<IXService.IGetChunkDocumentOutput> {
  //   try {
  //     const chunkDocument = await this.getChunkDocument({
  //       chatId: input.chatId,
  //       query: input.query,
  //     });
  //     return chunkDocument;
  //   } catch (err) {
  //     console.error(JSON.stringify(err));
  //     throw err;
  //   }
  // }

  private async getTweetUserInformations(
    input: IXService.IUserInput,
  ): Promise<IXService.IUserOutput[]> {
    const accessToken = await this.refresh();

    try {
      const userPromises = input.userNames.map(async (userName: string) => {
        const res = await axios.get(
          `https://api.x.com/2/users/by/username/${userName}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );

        return {
          id: res.data.data.id,
          name: res.data.data.name,
          userName: res.data.data.username,
        };
      });

      return await Promise.all(userPromises);
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  // private async getTweet(
  //   input: IXService.IGetTweetInput,
  //   accessTokenValue?: string,
  // ): Promise<IXService.ITweetOutput> {
  //   try {
  //     const accessToken = accessTokenValue ?? (await this.refresh());
  //     const tweet = await axios.get(
  //       `https://api.x.com/2/tweets/${input.tweetId}`,
  //       {
  //         params: {
  //           expansions: "author_id",
  //         },
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       },
  //     );

  //     const tweetData = tweet?.data?.data;
  //     if (!tweetData) {
  //       // Return default value if tweet is unavailable
  //       return {
  //         id: "",
  //         text: "This tweet is unavailable",
  //         userName: "Unknown",
  //         tweet_link: "This tweet is unavailable",
  //         type: "This tweet is unavailable",
  //         referredUserName: null,
  //         referredTweetLink: null,
  //         referredTweetText: null,
  //       };
  //     }

  //     let authorName: string = "";
  //     let authorTweetName: string = "";

  //     const author = await axios.get(
  //       `https://api.x.com/2/users/${tweet.data.data.author_id}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       },
  //     );
  //     authorName = author.data.data.name;
  //     authorTweetName = author.data.data.username;

  //     return {
  //       id: tweet.data.data.id,
  //       text: tweet.data.data.text,
  //       userName: authorName,
  //       tweet_link: `https://twitter.com/${authorTweetName}/status/${tweet.data.data.id}`,
  //       type: "Details for referred tweet",
  //       referredUserName: null,
  //       referredTweetLink: null,
  //       referredTweetText: null,
  //     };
  //   } catch (err) {
  //     console.error(JSON.stringify(err));
  //     throw err;
  //   }
  // }

  // private async getUserTimelineTweets(
  //   input: IXService.IUserTweetTimeLineInput,
  // ): Promise<IXService.ITweetOutput[]> {
  //   try {
  //     const accessToken = await this.refresh(input);
  //     const result: IXService.ITweetOutput[] = [];
  //     for (const user of input.user) {
  //       if (!user.id || !user.name) {
  //         console.error("X User id and user name are required");
  //       }

  //       const userTimeLineTweets =
  //         await ConnectorGlobal.prisma.x_tweet.findMany({
  //           where: {
  //             x_user_id: user.id,
  //             created_at: {
  //               lte: new Date().toISOString(),
  //               gte: new Date(
  //                 new Date().getTime() - 1000 * 60 * 60 * 24,
  //               ).toISOString(),
  //             },
  //           },
  //           orderBy: {
  //             created_at: "desc",
  //           },
  //         });

  //       if (userTimeLineTweets.length > 0) {
  //         userTimeLineTweets.forEach((tweet) => {
  //           result.push({
  //             id: tweet.id,
  //             userName: user.name,
  //             text: tweet.text,
  //             tweet_link: `https://twitter.com/${user.userName}/status/${tweet.id}`,
  //             type: tweet.type,
  //             referredUserName: tweet.referred_user_name,
  //             referredTweetLink: tweet.referred_tweet_link,
  //             referredTweetText: tweet.referred_tweet_text,
  //           });
  //         });
  //       } else {
  //         const userTweetTimeLines = await axios.get(
  //           `https://api.x.com/2/users/${user.id}/tweets`,
  //           {
  //             params: {
  //               max_results: 100,
  //               expansions: "referenced_tweets.id",
  //               "tweet.fields": "created_at",
  //               end_time: new Date().toISOString(),
  //               start_time: new Date(
  //                 new Date().getTime() - 1000 * 60 * 60 * 24,
  //               ).toISOString(),
  //             },
  //             headers: {
  //               Authorization: `Bearer ${accessToken}`,
  //             },
  //           },
  //         );

  //         if (
  //           userTweetTimeLines &&
  //           userTweetTimeLines.data &&
  //           userTweetTimeLines.data.data
  //         ) {
  //           for (const userTweetTimeLine of userTweetTimeLines.data.data) {
  //             // If Retweet or Quoted Tweet, get the original tweet. Exclude the replied tweet.
  //             if (
  //               userTweetTimeLine.referenced_tweets &&
  //               userTweetTimeLine.referenced_tweets.length > 0
  //             ) {
  //               for (const referencedTweet of userTweetTimeLine.referenced_tweets) {
  //                 if (referencedTweet.type !== "replied") {
  //                   const originalTweet = await this.getTweet(
  //                     {
  //                       secretKey: input.secretKey,
  //                       tweetId: referencedTweet.id,
  //                     },
  //                     accessToken,
  //                   );
  //                   await ConnectorGlobal.prisma.x_tweet.create({
  //                     data: {
  //                       id: v4(),
  //                       tweet_id: userTweetTimeLine.id,
  //                       x_user_id: user.id,
  //                       text: userTweetTimeLine.text,
  //                       link: `https://twitter.com/${user.userName}/status/${userTweetTimeLine.id}`,
  //                       type:
  //                         referencedTweet.type === "retweeted"
  //                           ? "retweeted"
  //                           : "quoted",
  //                       referred_user_name: originalTweet.userName,
  //                       referred_tweet_link: originalTweet.tweet_link,
  //                       referred_tweet_text: originalTweet.text,
  //                       created_at: new Date().toISOString(),
  //                     },
  //                   });
  //                   result.push({
  //                     id: userTweetTimeLine.id,
  //                     userName: user.name,
  //                     text: userTweetTimeLine.text,
  //                     tweet_link: `https://twitter.com/${user.userName}/status/${userTweetTimeLine.id}`,
  //                     type:
  //                       referencedTweet.type === "retweeted"
  //                         ? "retweeted"
  //                         : "quoted",
  //                     referredUserName: originalTweet.userName,
  //                     referredTweetLink: originalTweet.tweet_link,
  //                     referredTweetText: originalTweet.text,
  //                   });
  //                 }
  //               }
  //             } else {
  //               await ConnectorGlobal.prisma.x_tweet.create({
  //                 data: {
  //                   id: v4(),
  //                   tweet_id: userTweetTimeLine.id,
  //                   x_user_id: user.id,
  //                   text: userTweetTimeLine.text,
  //                   link: `https://twitter.com/${user.userName}/status/${userTweetTimeLine.id}`,
  //                   type: "original",
  //                   referred_user_name: null,
  //                   referred_tweet_link: null,
  //                   referred_tweet_text: null,
  //                   created_at: new Date().toISOString(),
  //                 },
  //               });
  //               result.push({
  //                 id: userTweetTimeLine.id,
  //                 userName: user.name,
  //                 text: userTweetTimeLine.text,
  //                 tweet_link: `https://twitter.com/${user.userName}/status/${userTweetTimeLine.id}`,
  //                 type: "original",
  //                 referredUserName: null,
  //                 referredTweetLink: null,
  //                 referredTweetText: null,
  //               });
  //             }
  //           }
  //         } else {
  //           console.log(`X ${user.name} tweet timeline is empty`);
  //         }
  //       }
  //     }
  //     console.log(
  //       `Successfully get Timeline Tweet Data: ${JSON.stringify(result)}, length: ${result.length}`,
  //     );
  //     return result;
  //   } catch (err) {
  //     console.error(JSON.stringify(err));
  //     throw err;
  //   }
  // }

  // private async makeTxtFileForTweetAndUploadToS3(
  //   input: IXService.ITweetOutput[],
  // ): Promise<IXService.IMakeTxtFileAndUploadOutput[]> {
  //   try {
  //     const uploadPromises = input.map(async (tweet) => {
  //       const fileName = `${v4()}_${new Date().toISOString()}_tweet.txt`;
  //       let fileContent = "";

  //       fileContent += `<tweets>\n`;
  //       fileContent += `<tweet>\n`;
  //       fileContent += `userName: ${tweet.userName}\n`;
  //       fileContent += `content: ${tweet.text}\n`;
  //       if (tweet.referredUserName) {
  //         fileContent += `referredUserName: ${tweet.referredUserName}\n`;
  //       }
  //       if (tweet.referredTweetText) {
  //         fileContent += `referredTweetContent: ${tweet.referredTweetText}\n`;
  //       }
  //       fileContent += `</tweet>\n`;
  //       fileContent += `</tweets>\n`;

  //       const fileUrl = await AwsProvider.uploadObject({
  //         key: `tweets/${fileName}`,
  //         data: Buffer.from(fileContent, "utf-8"),
  //         contentType: "text/plain; charset=utf-8",
  //       });

  //       console.log(`Successfully uploaded ${fileName} to S3`);
  //       return {
  //         fileUrl: fileUrl,
  //       };
  //     });
  //     return await Promise.all(uploadPromises);
  //   } catch (err) {
  //     console.error(`Failed to upload tweets to S3`);
  //     throw err;
  //   }
  // }

  // private async getChunkDocument(
  //   input: IXService.IGetChunkDocumentInput,
  // ): Promise<IXService.IGetChunkDocumentOutput> {
  //   try {
  //     const chunkDocument = await axios.post(
  //       `${ConnectorGlobal.env.RAG_FLOW_SERVER_URL}/v1/index/${ConnectorGlobal.env.RAG_FLOW_DOCUMENT_INDEX}/query`,
  //       {
  //         query: input.query,
  //         topk: ConnectorGlobal.env.RAG_FLOW_TOPK,
  //         filters: [
  //           {
  //             chat_id: input.chatId,
  //           },
  //         ],
  //       },
  //       {
  //         headers: {
  //           "x-service-id": "eco_file_chat",
  //         },
  //       },
  //     );

  //     const chunkDocumentData = chunkDocument.data.documents;
  //     if (chunkDocumentData.length === 0) {
  //       console.error(`Get Chunk Document Failed: No data found`);
  //       throw new Error("Chunk Document is empty");
  //     }

  //     const filteredDocuments = chunkDocumentData.map((document: any) => {
  //       const { metadata, ...rest } = document;
  //       const {
  //         url,
  //         file_fingerprint,
  //         md5_digest,
  //         file_type,
  //         ...filteredMetadata
  //       } = metadata; // url, file_fingerprint, md5_digest, file_type 필드를 제외하고 나머지 필드만 가져옴
  //       return {
  //         ...rest,
  //         metadata: filteredMetadata,
  //       };
  //     });

  //     console.log(
  //       `Successfully get chunk document: chatId: ${input.chatId}, body: ${JSON.stringify(filteredDocuments)}`,
  //     );

  //     return {
  //       documents: filteredDocuments,
  //     };
  //   } catch (err) {
  //     if (
  //       err instanceof AxiosError &&
  //       err.response &&
  //       err.response.status === 400
  //     ) {
  //       console.error(`Get Chunk Document Failed: ${err.response.data.detail}`);
  //       throw new Error(`Get Chunk Document Failed`);
  //     } else if (
  //       err instanceof AxiosError &&
  //       err.response &&
  //       err.response.status === 422
  //     ) {
  //       console.error(`Get Chunk Document Failed: ${err.response.data.detail}`);
  //       throw new Error(`Get Chunk Document Failed`);
  //     } else {
  //       throw new Error("Get Chunk Document Failed");
  //     }
  //   }
  // }

  async refresh(): Promise<string> {
    try {
      const params = new URLSearchParams();
      params.append("grant_type", "refresh_token");
      params.append("refresh_token", this.props.bearerToken);
      params.append("client_id", this.props.clientId);
      const BasicAuthToken = Buffer.from(
        `${this.props.clientId}:${this.props.clientSecret}`,
        "utf8",
      ).toString("base64");
      const res = await axios.post("https://api.x.com/2/oauth2/token", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${BasicAuthToken}`,
        },
      });

      /**
       * Only for test environment
       */
      // if (process.env.NODE_ENV === "test") {
      //   await ConnectorGlobal.write({
      //     X_TEST_SECRET: res.data.refresh_token,
      //   });
      // }
      this.props.bearerToken = res.data.refresh_token;
      return res.data.access_token;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  async generalSearch(
    input: IXService.IGeneralSearchRequest,
  ): Promise<IXService.IGeneralSearchResponse[]> {
    try {
      const query = this.makeQuery(input);
      const searchResult = await axios.get(
        `https://api.x.com/2/tweets/search/all`,
        {
          params: {
            query: query,
            expansions: "author_id,attachments.media_keys",
            "tweet.fields": "created_at,public_metrics",
            "user.fields": "id,name,username",
            "media.fields": "preview_image_url,url",
            max_results: input.maxResults,
            sort_order: input.sort_order,
            ...(input.start_time && { start_time: input.start_time }),
            ...(input.end_time && { end_time: input.end_time }),
          },
          headers: {
            Authorization: `Bearer ${this.props.bearerToken}`,
          },
        },
      );

      if (!searchResult?.data) {
        return [];
      }

      const tweetData = searchResult?.data?.data;
      const tweetUserData: { id: string; name: string; username: string }[] =
        searchResult?.data?.includes?.users;
      const mediaData = searchResult?.data?.includes?.media || [];

      if (!tweetData || !tweetUserData) {
        return [];
      }

      const userMap = new Map(
        tweetUserData.map(
          (user: { id: string; name: string; username: string }) => [
            user.id,
            user,
          ],
        ),
      );

      const results: IXService.IGeneralSearchResponse[] = tweetData.map(
        (tweet: {
          id: string;
          author_id: string;
          text: string;
          edit_history_tweet_ids: string[];
          public_metrics: {
            retweet_count: number;
            reply_count: number;
            like_count: number;
            quote_count: number;
            bookmark_count: number;
            impression_count: number;
          };
          attachments: { media_keys: string[] };
        }) => {
          const user = userMap.get(tweet.author_id);
          const mediaKeys = tweet.attachments?.media_keys || [];
          const media = mediaKeys.map((key) =>
            mediaData.find(
              (m: {
                media_key: string;
                type: string;
                url: string;
                preview_image_url?: string;
              }) => m.media_key === key,
            ),
          );

          const thumbnail =
            media.find((m) => m?.preview_image_url)?.preview_image_url ||
            media.find((m) => m?.url)?.url ||
            null;

          return {
            id: tweet.id,
            text: tweet.text,
            userName: user?.username,
            tweet_link: `https://twitter.com/${user?.username}/status/${tweet.id}`,
            metric: tweet.public_metrics,
            thumbnail: thumbnail,
          };
        },
      );

      return results;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  private makeQuery(input: IXService.IGeneralSearchRequest): string {
    let query = "";

    query += input.query;

    if (input.isExcludeQuote) {
      query += " -is:quote";
    }

    if (input.isExcludeRetweet) {
      query += " -is:retweet";
    }

    if (input.isExcludeReply) {
      query += " -is:reply";
    }

    return `${query} has:media lang:${input.lang}`;
  }
}
