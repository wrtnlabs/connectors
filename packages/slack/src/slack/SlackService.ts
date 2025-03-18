import axios from "axios";
import typia, { tags } from "typia";
import { ISlackService } from "../structures/ISlackService";
import {
  createQueryParameter,
  ElementOf,
  PickPartial,
  retry,
  StrictOmit,
} from "@wrtnlabs/connector-shared";
import { WebClient } from "@slack/web-api";
import slackifyMarkdown from "slackify-markdown";
import { SlackTemplateService } from "./SlackTemplateService";

export class SlackService {
  constructor(private readonly props: ISlackService.IProps) {}

  /**
   * Slack Service.
   *
   * Delete the scheduled message
   *
   * To clear a scheduled message,
   * you must get the exact id of that message, so you must first use the scheduled message lookup connector.
   * When using this connector,
   * the ID of the channel is also required, which can be retrieved from the message object by querying the channel or by querying the scheduled message.
   */
  async deleteScheduleMessage(
    input: ISlackService.IDeleteSCheduleMessageInput,
  ): Promise<void> {
    try {
      const url = `https://slack.com/api/chat.deleteScheduledMessage`;

      await axios.post(
        url,
        {
          ...input,
        },
        {
          headers: {
            Authorization: `Bearer ${this.props.secretKey}`,
            "Content-Type": "application/json; charset=utf-8;",
          },
        },
      );
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Slack Service.
   *
   * Get a list of scheduled messages
   *
   * Look up the messages you booked.
   * You can use `post_at` and `post_at_date` to find out when the message will be sent.
   * If you want to clear the message, use the `id` value in the scheduled message.
   *
   * If a user wants to send a reservation message to himself,
   * he or she should look up both the user and the 'im' channel, then find the 'im' channel with his or her user ID and send it to that channel.
   * What is on the 'im' channel includes not only the user's own channel, but also all the channels that can send and receive direct messages for each user.
   */
  async getScheduledMessages(
    input: ISlackService.IGetScheduledMessageListInput,
  ): Promise<ISlackService.IGetScheduledMessageListOutput> {
    const url = `https://slack.com/api/chat.scheduledMessages.list`;
    try {
      const queryParameter = createQueryParameter(input);

      const res = await axios.post(
        `${url}?${queryParameter}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${this.props.secretKey}`,
            "Content-Type": "application/json; charset=utf-8;",
          },
        },
      );

      const next_cursor = res.data.response_metadata?.next_cursor;
      const scheduled_messages = res.data.scheduled_messages.map(
        (
          message: any,
        ): ElementOf<
          ISlackService.IGetScheduledMessageListOutput["scheduled_messages"]
        > => {
          const timestampString =
            String(message.post_at).split(".").at(0) + "000";
          const timestamp = Number(timestampString);

          return {
            id: message.id,
            channel: message.channel_id,
            post_at: String(message.post_at) as string,
            post_at_date: new Date(timestamp).toISOString(),
            date_created: String(message.date_created),
            text: message.text,
          };
        },
      );

      return { scheduled_messages, next_cursor };
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Slack Service.
   *
   * Create a schduled message
   *
   * By default,
   * it is not much different from sending a message except for specifying a schduled time,
   * and requires a channel ID and message content.
   * If the message you want to schedule is within a specific thread, you must pass the ts value of the parent message.
   *
   * Messages booked through this feature are not visible in the Slack desktop app and can only be canceled through the API.
   * Therefore, be careful in writing messages.
   * If you want to cancel, please refer to the message created through another connector and call the delete connector again.
   *
   * Users may be embarrassed if the message you booked is not viewed in the Slack desktop app,
   * so although it cannot be viewed before and after transmission,
   * it would be a good idea to let them know that it will actually be transmitted in our service.
   */
  async sendScheduleMessage(
    input: ISlackService.ISCheduleMessageInput,
  ): Promise<Pick<ISlackService.ScheduledMessage, "post_at">> {
    const url = `https://slack.com/api/chat.scheduleMessage`;

    try {
      const res = await axios.post(
        url,
        {
          channel: input.channel,
          text: `${input.text}\n\n\n\n> Sent by Action Agent in Wrtn Studio Pro`,
          post_at: input.post_at,
          ...(input.thread_ts && { thread_ts: input.thread_ts }),
        },
        {
          headers: {
            Authorization: `Bearer ${this.props.secretKey}`,
          },
        },
      );

      return { post_at: String(res.data.post_at) };
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * @hidden
   */
  async interactivity(
    input: ISlackService.InteractiveComponentInput,
  ): Promise<any[]> {
    const { user, actions, message, channel } = input.payload;

    const block_id = actions.at(0)?.block_id;
    const value = actions.at(0)?.value;
    const blocks = message?.blocks;
    if (channel && blocks && value) {
      const selectedItemIdx = blocks.findIndex(
        (block) => block.block_id === block_id,
      );

      // const [_, secretKey] = value.split("/");

      const users = await this.getAllUsers();
      const userDetail = users.find((el) => el.id === user.id);

      if (userDetail && selectedItemIdx && selectedItemIdx !== -1) {
        // 눌린 버튼의 다음 번 객체가 context block 이기 때문에 + 1을 더한다.
        const contextBlockIdx = selectedItemIdx + 1;
        const contextBlock = blocks.at(contextBlockIdx);
        const uniqueUserId = `${userDetail.display_name}(${userDetail.id})`;
        if (typia.is<ISlackService.NoVoted>(contextBlock)) {
          contextBlock.elements = [
            {
              type: "image",
              image_url: userDetail.profile_image,
              alt_text: uniqueUserId,
            },
          ] as any;
        } else if (typia.is<ISlackService.Voted>(contextBlock)) {
          const alreadyVoted = contextBlock.elements.findIndex(
            (voter) => voter.alt_text === uniqueUserId,
          );

          if (alreadyVoted !== -1) {
            // 이미 투표를 한 경우, 투표자 명단에서 제거한다.
            contextBlock.elements.splice(alreadyVoted, 1);
            if (contextBlock.elements.length === 0) {
              blocks[contextBlockIdx] = {
                type: "context",
                elements: [
                  {
                    type: "mrkdwn",
                    text: "No votes",
                  },
                ],
              };
            }
          } else {
            // 아직 투표를 안한 경우, 투표자 명단에서 추가한다.
            contextBlock.elements.push({
              type: "image",
              image_url: userDetail.profile_image,
              alt_text: uniqueUserId,
            });
          }
        }
      }

      await new WebClient(this.props.secretKey).chat.update({
        channel: channel.id,
        blocks: blocks,
        ts: message.ts,
      });
    }

    return blocks ?? [];
  }

  /**
   * Slack Service.
   *
   * Marks a specific message in a Slack channel as read
   *
   * You need to know both the channel ID and the ts value of the message.
   */
  async mark(input: ISlackService.IMarkInput): Promise<void> {
    const url = `https://slack.com/api/conversations.mark`;

    try {
      await axios.post(
        url,
        {
          channel: input.channel,
          ts: input.ts,
        },
        {
          headers: {
            Authorization: `Bearer ${this.props.secretKey}`,
          },
        },
      );
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Slack Service.
   *
   * send reply message to thread
   *
   * Creates a reply.
   * To reply, you must first look up the thread.
   * You can look up the thread and pass on the 'ts' value of that thread.
   * You still need the channel's ID here.
   * The channel's ID will start with a C or D and be an unknown string,
   * not a natural language name recognized by the user.
   * Therefore, if you don't know the channel ID, you should also look up the channel.
   */
  async sendReply(
    input: ISlackService.IPostMessageReplyInput,
  ): Promise<Pick<ISlackService.Message, "ts">> {
    return this.sendMessage({
      channel: input.channel,
      secretKey: this.props.secretKey,
      text: input.text,
      thread_ts: input.ts,
    });
  }

  /**
   * Slack Service.
   *
   * Inquire the inside of the thread in History
   *
   * If you have inquired the history of a channel,
   * you can use the 'ts' values of its history elements to query the internal thread for each history again.
   * Each channel history has a number of replies, so if this number is more than 1, it is worth looking up.
   * 'Reply' is basically no different from the 'Message'(=Channel History).
   *
   * @param input
   * @returns Replies
   */
  async getReplies(
    input: ISlackService.IGetReplyInput,
  ): Promise<ISlackService.IGetReplyOutput> {
    const queryParameter = createQueryParameter(input);

    const url = `https://slack.com/api/conversations.replies?pretty=1`;

    const [{ url: workspaceUrl }, allMembers, { usergroups }, res] =
      await Promise.all([
        this.authTest(),
        this.getAllUsers(),
        this.getUserGroups(),
        axios.get(`${url}&${queryParameter}`, {
          headers: {
            Authorization: `Bearer ${this.props.secretKey}`,
            "Content-Type": "application/json; charset=utf-8;",
          },
        }),
      ]);

    const link_count = 0;
    const next_cursor = res.data.response_metadata?.next_cursor;
    const replies: ISlackService.ChannelHistory[] = res.data.messages.map(
      (message: ISlackService.Reply): ISlackService.ChannelHistory =>
        this.convertMessageFormat({
          message: { ...message, channel: input.channel },
          channel: input.channel,
          link_count,
          allMembers,
          workspaceUrl,
          allUsergroups: usergroups,
        }),
    );

    const includedUsergroups = this.extract("usergroup")?.({
      response: replies,
      allUserGroup: usergroups,
    });

    const userIds = Array.from(
      new Set(replies.map((message) => message.user).filter(Boolean)),
    );

    const im_channels = await this.__getAllImChannels();

    const members = this.getMembers({
      userIds,
      allMembers,
      im_channels,
    });

    return {
      replies,
      next_cursor: next_cursor ? next_cursor : null,
      members,
      usergroups: includedUsergroups ?? [],
      channel: await this.getChannelName(input),
    };
  }

  /**
   * Slack Service.
   *
   * Get Specific Message Information.
   *
   * Get channel information and ts and get information of a specific message.
   * 'ts' is the first 10 digits the Whole number part and the rest are the fractional part.
   *
   * @param input
   * @returns
   */
  async getMessage(
    input: ISlackService.IGetReplyInput,
  ): Promise<ISlackService.IGetReplyOutput> {
    const queryParameter = createQueryParameter(input);

    const url = `https://slack.com/api/conversations.replies?pretty=1`;

    const [{ url: workspaceUrl }, allMembers, { usergroups }, res] =
      await Promise.all([
        this.authTest(),
        this.getAllUsers(),
        this.getUserGroups(),
        axios.get(`${url}&${queryParameter}`, {
          headers: {
            Authorization: `Bearer ${this.props.secretKey}`,
            "Content-Type": "application/json; charset=utf-8;",
          },
        }),
      ]);

    const link_count = 0;
    const next_cursor = res.data.response_metadata?.next_cursor;
    const replies: ISlackService.ChannelHistory[] = res.data.messages
      .slice(0, 1) // 0번째 인덱스는 부모 스레드가 나오기 때문
      .map(
        (message: ISlackService.Reply): ISlackService.ChannelHistory =>
          this.convertMessageFormat({
            message: { ...message, channel: input.channel },
            channel: input.channel,
            link_count,
            allMembers,
            workspaceUrl,
            allUsergroups: usergroups,
          }),
      );

    const includedUsergroups = this.extract("usergroup")?.({
      response: replies,
      allUserGroup: usergroups,
    });

    const userIds = Array.from(
      new Set(replies.map((message) => message.user).filter(Boolean)),
    );

    const im_channels = await this.__getAllImChannels();

    const members = this.getMembers({
      userIds,
      allMembers,
      im_channels,
    });

    return {
      replies,
      next_cursor: next_cursor ? next_cursor : null,
      members,
      usergroups: includedUsergroups ?? [],
      channel: await this.getChannelName(input),
    };
  }

  /**
   * Slack Service.
   *
   * Inquire user details
   *
   * Inquire the user's detailed profile to acquire information such as phone number, email, and position.
   * It cannot be verified if the user has not filled in.
   * This function receives the user's ID in an array and inquires at once.
   */
  async getUserDetails(
    input: ISlackService.IGetUserDetailInput,
  ): Promise<ISlackService.IGetUserDetailOutput[]> {
    const response: ISlackService.IGetUserDetailOutput[] = [];

    const im_channels = await this.__getAllImChannels();

    const fetch = async (userId: string) => {
      const url = `https://slack.com/api/users.profile.get?include_labels=true&user=${userId}`;

      try {
        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${this.props.secretKey}`,
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8;",
          },
        });

        if (typia.is<{ ok: false; error: "ratelimited" }>(res.data)) {
          throw new Error(res.data.error);
        }

        const fields = this.getUserProfileFields(res.data.profile);
        return { ...res.data.profile, fields };
      } catch (err) {
        console.error(JSON.stringify(err));
        throw err;
      }
    };

    for await (const userId of input.userIds) {
      const fetched: StrictOmit<
        ISlackService.IGetUserDetailOutput,
        "im_channel_id"
      > = await retry(() => fetch(userId))();

      const im_channel = im_channels.find((channel) => channel.user === userId);

      response.push({
        ...fetched,
        id: userId,
        im_channel_id: im_channel?.id ?? null,
      });
    }

    return response;
  }

  /**
   * Slack Service.
   *
   * Look up the list of users.
   *
   * Users include bots and refer to all users in the team who are looking up.
   * Here, you can look up the user's ID and name, the name the user wanted to display, the profile image, and whether the user has been deleted.
   * If you look up the user here, you can send a message to your colleagues on a specific direct channel, such as an `im` ( = channel type. )
   *
   * This connector is essential because the `im` channel query only shows the user's ID and does not know who the direct channel is talking to.
   *
   * The user has a separate display name.
   * A display name is a name that the user has chosen to show.
   * Therefore, it would be best to use this name as a courtesy.
   *
   * It can look up Slack users, but it can look up the entire user through pagenation.
   * There could be hundreds of people in the company, so you'll have to look at multiple pages.
   */
  async getUsers(
    input: ISlackService.IGetUserListInput,
  ): Promise<ISlackService.IGetUserListOutput> {
    const queryParameter = createQueryParameter(input);
    const im_channels = await this.__getAllImChannels();

    const url = `https://slack.com/api/users.list?pretty=1`;

    const res = await axios.get(`${url}&${queryParameter}`, {
      headers: {
        Authorization: `Bearer ${this.props.secretKey}`,
        "Content-Type": "application/json; charset=utf-8;",
      },
    });

    const next_cursor = res.data.response_metadata?.next_cursor;
    type User = StrictOmit<ISlackService.IGetUserOutput, "fields">;
    const users: User[] = res.data.members.map(
      (el: ISlackService.User): User => {
        const im_channel = im_channels.find(
          (channel) => channel.user === el.id,
        );

        return {
          id: el.id,
          slack_team_id: el.team_id,
          im_channel_id: im_channel?.id ?? null,
          name: el.name,
          real_name: el.profile.real_name ?? null,
          display_name: el.profile.display_name,
          deleted: el.deleted,
          profile_image: el.profile.image_original
            ? el.profile.image_original
            : null,
        };
      },
    );

    return { users, next_cursor: next_cursor ? next_cursor : null };
  }

  /**
   * Slack Service.
   *
   * send message to myself
   *
   * Here, you can send a message as long as you have the message.
   * This feature identifies who the token's users are inside and sends a message to themselves.
   * Therefore, even if you don't specify a channel,
   * you send a message to the `im` channel that corresponds to your own user id.
   */
  async sendTextToMyself(
    input: ISlackService.IPostMessageToMyselfInput,
  ): Promise<Pick<ISlackService.Message, "ts">> {
    const { channels } = await this.getImChannels();
    const auth = await this.authTest();
    const channel = channels.find((el) => el.user === auth.user_id);
    return this.sendMessage({
      channel: channel?.id as string,
      secretKey: this.props.secretKey,
      text: input.text,
    });
  }

  /**
   * Slack Service.
   *
   * Update message body
   *
   * Use to modify messages sent by users.
   * If the message is not sent by the user, user cannot modify it.
   */
  async updateMessage(
    input: ISlackService.IUpdateMessageInput,
  ): Promise<ISlackService.IUpdateMessageOutput> {
    const client = new WebClient(this.props.secretKey);
    const preconfiged = `${input.text}\n\n\n\n> Sent by Action Agent in Wrtn Studio Pro`;
    const text = slackifyMarkdown(preconfiged);
    const res = await client.chat.update({
      channel: input.channel,
      text: text.replaceAll("\\n", "\n"), // 줄바꿈 문자를 잘못 입력했을 경우에 대비한다.
      token: this.props.secretKey,
      ts: input.thread_ts,
      attachments: [],
    });

    if (!res.ts) {
      throw new Error("Failed to update slack message");
    }

    return { ts: res.ts };
  }

  async getTeamInfo(): Promise<{
    id: string;
    name: String;
    domain: string;
    email_domain: string;
    enterprise_id: string;
    enterprise_name: string;
  }> {
    const url = `https://slack.com/api/team.info`;

    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secretKey}`,
      },
    });

    return res.data.team;
  }

  private async sendMessage(input: {
    channel: string;
    text: string;
    secretKey: string;
    thread_ts?: string;
  }): Promise<Pick<ISlackService.Message, "ts">> {
    const url = `https://slack.com/api/chat.postMessage`;

    try {
      const preconfiged = `${input.text}\n\n\n\n> Sent by Action Agent in Wrtn Studio Pro`;
      const text = slackifyMarkdown(preconfiged);
      const res = await axios.post(
        url,
        {
          channel: input.channel,
          text: text.replaceAll("\\n", "\n"), // 줄바꿈 문자를 잘못 입력했을 경우에 대비한다.
          ...(input.thread_ts && { thread_ts: input.thread_ts }),
        },
        {
          headers: {
            Authorization: `Bearer ${this.props.secretKey}`,
          },
        },
      );

      const ts = res.data.ts;
      if (!ts) {
        throw new Error("Failed to send slack message.");
      }

      return { ts: res.data.ts };
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  async authTest(): Promise<ISlackService.IAuthTestOutput> {
    const res = await axios.get("https://slack.com/api/auth.test", {
      headers: {
        Authorization: `Bearer ${this.props.secretKey}`,
      },
    });

    return res.data;
  }

  /**
   * Slack Service.
   *
   * send message to channel
   *
   * Here, you can send a message as long as you have the message and channel information you want to send.
   * Slack is a very close service to work, so it's dangerous to send messages that haven't been confirmed.
   * You must send the contents after receiving confirmation from the user.
   *
   * If you want to send a message to a DM channel, you need to search for an IM channel.
   * Most IM channel IDs will start with 'D', but if the value provided by the user is a value that starts with 'U',
   * this is most likely the user ID of the IM channel, not the channel.
   * You need to search for a user starting with that ID and then send a message.
   */
  async sendText(
    input: ISlackService.IPostMessageInput,
  ): Promise<Pick<ISlackService.Message, "ts">> {
    return this.sendMessage({
      channel: input.channel,
      secretKey: this.props.secretKey,
      text: input.text,
    });
  }

  /**
   * Slack Service.
   *
   * Get Channel Links from Channel Histories
   *
   * Retrieves conversations in and out of channels.
   * A channel ID starts with 'C' or 'D' (uppercase). If no ID is provided, search by channel name or keywords.
   * Users often don’t know channel IDs, so prioritize finding the channel unless the input starts with 'C' or 'D'.
   * Search conversations within specific timeframes using datetime formats.
   * Filters out messages without links, retaining only those with links in the links property.
   * This ensures efficient link extraction from conversation histories.
   */
  async getChannelLinkHistories(
    input: ISlackService.IGetChannelHistoryInput,
  ): Promise<ISlackService.IGetChannelLinkHistoryOutput> {
    const url = `https://slack.com/api/conversations.history?&pretty=1`;
    const queryParameter = createQueryParameter({
      channel: input.channel,
      cursor: input.cursor,
      limit: input.limit,
      ...(input.latestDateTime && {
        latest: this.transformDateTimeToTs(input.latestDateTime),
      }),
      ...(input.oldestDateTime && {
        oldest: this.transformDateTimeToTs(input.oldestDateTime),
      }),
    });

    const [{ url: workspaceUrl }, allMembers, { usergroups }, res] =
      await Promise.all([
        this.authTest(),
        this.getAllUsers(),
        this.getUserGroups(),
        axios.get(`${url}&${queryParameter}`, {
          headers: {
            Authorization: `Bearer ${this.props.secretKey}`,
            "Content-Type": "application/json; charset=utf-8;",
          },
        }),
      ]);

    const link_count = 0;
    const next_cursor = res.data.response_metadata?.next_cursor;
    const messages: ISlackService.ChannelHistory[] = res.data.messages
      .map(
        (message: ISlackService.Message): ISlackService.ChannelHistory =>
          this.convertMessageFormat({
            message,
            channel: input.channel,
            link_count,
            allMembers,
            workspaceUrl,
            allUsergroups: usergroups,
          }),
      )
      .filter((message: ISlackService.LinkMessage) => {
        return message.links.length !== 0;
      });

    const includedUsergroups = this.extract("usergroup")?.({
      response: messages,
      allUserGroup: usergroups,
    });

    const userIds = Array.from(
      new Set(messages.map((message) => message.user).filter(Boolean)),
    );

    const im_channels = await this.__getAllImChannels();

    const members = this.getMembers({
      userIds,
      allMembers,
      im_channels,
    });

    return {
      messages,
      next_cursor: next_cursor ? next_cursor : null,
      members,
      usergroups: includedUsergroups ?? [],
      channel: await this.getChannelName(input),
    }; // next_cursor가 빈 문자인 경우 대비
  }

  private async getChannelName(
    input: Pick<
      ISlackService.IGetChannelHistoryInput,
      "channel_type" | "channel"
    >,
  ): Promise<{ name: string | null }> {
    const { channel_type, channel: channel_id } = input;
    if (channel_type === "public" || channel_type === undefined) {
      const channel = (await this.getAllPublicChannels()).find(
        (el) => el.id === channel_id,
      );
      if (channel) return { name: channel.name };
    } else if (channel_type === "private" || channel_type === undefined) {
      const channel = (await this.getAllPrivateChannels()).find(
        (el) => el.id === channel_id,
      );
      if (channel) return { name: channel.name };
    } else if (channel_type === "im" || channel_type === undefined) {
      const channel = (await this.getAllImChannels()).find(
        (el) => el.id === channel_id,
      );
      if (channel) return { name: channel.username ?? null };
    }

    return { name: null };
  }

  /**
   * Slack Service.
   *
   * Get Channel Histories
   *
   * Retrieves conversations in and out of channels.
   * Channel IDs start with 'C' or 'D' (uppercase). If no ID is provided, search by channel name or keywords.
   * Users typically don’t know channel IDs, so prioritize finding the channel unless the input starts with 'C' or 'D'.
   * Search conversations within specific timeframes using datetime formats.
   * In history, links and code boxes are shown as <LINK/> and <CODE/>. Mentions appear as <@USERNAME>, but this indicates a mention, not the conversation starter.
   * Filters by date should prioritize the datetime format for accuracy.
   */
  async getChannelHistories(
    input: ISlackService.IGetChannelHistoryInput,
  ): Promise<ISlackService.IGetChannelHistoryOutput> {
    const url = `https://slack.com/api/conversations.history?&pretty=1`;
    const queryParameter = createQueryParameter({
      channel: input.channel,
      cursor: input.cursor,
      limit: input.limit,
      ...(input.latestDateTime && {
        latest: this.transformDateTimeToTs(input.latestDateTime),
      }),
      ...(input.oldestDateTime && {
        oldest: this.transformDateTimeToTs(input.oldestDateTime),
      }),
    });

    const [{ url: workspaceUrl }, allMembers, { usergroups }, res] =
      await Promise.all([
        this.authTest(),
        this.getAllUsers(),
        this.getUserGroups(),
        axios.get(`${url}&${queryParameter}`, {
          headers: {
            Authorization: `Bearer ${this.props.secretKey}`,
            "Content-Type": "application/json; charset=utf-8;",
          },
        }),
      ]);

    if (!res.data.ok) {
      throw new Error(
        `error: ${res.data.error}${res.data.needed ? `, needed: ${res.data.needed}` : {}}`,
      );
    }

    const link_count = 0;
    const next_cursor = res.data.response_metadata?.next_cursor;
    const messages: ISlackService.ChannelHistory[] = res.data.messages.map(
      (message: ISlackService.Message): ISlackService.ChannelHistory =>
        this.convertMessageFormat({
          message,
          channel: input.channel,
          link_count,
          allMembers,
          workspaceUrl,
          allUsergroups: usergroups,
        }),
    );

    const includedUsergroups = this.extract("usergroup")?.({
      response: messages,
      allUserGroup: usergroups,
    });

    const userIds = Array.from(
      new Set(messages.map((message) => message.user).filter(Boolean)),
    );

    const im_channels = await this.__getAllImChannels();

    const members = this.getMembers({
      userIds,
      allMembers,
      im_channels,
    });

    return {
      messages,
      next_cursor: next_cursor ? next_cursor : null,
      members,
      usergroups: includedUsergroups ?? [],
      channel: await this.getChannelName(input),
    }; // next_cursor가 빈 문자인 경우 대비
  }

  private getMembers(input: {
    userIds: (string | null)[];
    allMembers: StrictOmit<ISlackService.IGetUserOutput, "fields">[];
    im_channels: ISlackService.ImChannel[];
  }) {
    const members = input.userIds
      .map((userId) => {
        const member = input.allMembers.find((el) => el.id === userId);
        const im_channel = input.im_channels.find((el) => el.user === userId);

        return { ...member, im_channel_id: im_channel?.id ?? null };
      })
      .filter(Boolean) as Pick<
      ISlackService.IGetUserOutput,
      "id" | "display_name" | "im_channel_id"
    >[];

    return members;
  }

  /**
   * Slack Service.
   *
   * get private channels
   *
   * View channels.
   * This connector will only look up its own `private` channel.
   * The channel ID is required to look up the conversation history within the channel later.
   * `private` channel is a locked channel that can only be viewed by those invited to the channel.
   *
   * If you can't find the channel ID by name, it might be because it's on the next page, not because you don't have a channel.
   */
  async getAllPrivateChannels() {
    let nextCursor: string | null = null;
    let response: Awaited<
      ReturnType<typeof this.getPrivateChannels>
    >["channels"] = [];
    do {
      const { next_cursor, channels } = await this.getPrivateChannels({
        ...(nextCursor ? { cursor: nextCursor } : {}),
        limit: 1000,
      });

      response = response.concat(channels);
      nextCursor = next_cursor;
    } while (nextCursor);

    return response;
  }

  private async getPrivateChannels(
    input: ISlackService.IGetChannelInput,
  ): Promise<ISlackService.IGetPrivateChannelOutput> {
    const url = `https://slack.com/api/conversations.list?pretty=1`;
    const queryParameter = createQueryParameter({
      ...input,
      types: "private_channel",
    });

    const res = await axios.get(`${url}&${queryParameter}`, {
      headers: {
        Authorization: `Bearer ${this.props.secretKey}`,
        "Content-Type": "application/json; charset=utf-8;",
      },
    });

    const next_cursor = res.data.response_metadata?.next_cursor;
    const channels = res.data.channels.map(
      (channel: ISlackService.PrivateChannel) => {
        return {
          id: channel.id,
          name: channel.name,
        };
      },
    );
    return { channels, next_cursor: next_cursor ? next_cursor : null }; // next_cursor가 빈 문자인 경우 대비
  }

  /**
   * Slack Service.
   *
   * get public channels
   *
   * View channels.
   * This connector will only look up its own `public` channel.
   * The channel ID is required to look up the conversation history within the channel later.
   * The `public` channel is anyone's accessible.
   * This does not require an invitation process, and users can join the channel themselves if necessary.
   */
  async getAllPublicChannels() {
    let nextCursor: string | null = null;
    let response: Awaited<
      ReturnType<typeof this.getPublicChannels>
    >["channels"] = [];
    do {
      const { next_cursor, channels } = await this.getPublicChannels({
        ...(nextCursor ? { cursor: nextCursor } : {}),
        limit: 1000,
      });

      response = response.concat(channels);
      nextCursor = next_cursor;
    } while (nextCursor);

    return response;
  }

  private async getPublicChannels(
    input: ISlackService.IGetChannelInput,
  ): Promise<ISlackService.IGetPublicChannelOutput> {
    const url = `https://slack.com/api/conversations.list?pretty=1`;
    const queryParameter = createQueryParameter({
      ...input,
      types: "public_channel",
    });

    const res = await axios.get(`${url}&${queryParameter}`, {
      headers: {
        Authorization: `Bearer ${this.props.secretKey}`,
        "Content-Type": "application/json; charset=utf-8;",
      },
    });

    const next_cursor = res.data.response_metadata?.next_cursor;
    const channels = res.data.channels.map(
      (channel: ISlackService.PublicChannel) => {
        return {
          id: channel.id,
          name: channel.name,
        };
      },
    );
    return { channels, next_cursor: next_cursor ? next_cursor : null }; // next_cursor가 빈 문자인 경우 대비
  }

  /**
   * Slack Service.
   *
   * get im channels
   *
   * View channels.
   * This connector will only look up its own `im` channel.
   * The channel ID is required to look up the conversation history within the channel later.
   * `im` channel is a conversation that takes place in one's profile and refers to a personal channel that can only be viewed by oneself.
   * Users also use chat as storage or notepad, such as storing files and images here.
   *
   * To send a 1:1 message to other users, you must first look up the `im` channel.
   */
  async getAllImChannels() {
    const users = await this.getAllUsers();
    const response: Awaited<ReturnType<typeof this.getImChannels>>["channels"] =
      await this.__getAllImChannels();

    return response.map((channel) => {
      const user = users.find((user): boolean => user.id === channel.user);
      channel.username = user?.name ?? null;
      return channel;
    });
  }

  private async __getAllImChannels() {
    let nextCursor: string | null = null;
    let response: Awaited<ReturnType<typeof this.getImChannels>>["channels"] =
      [];
    do {
      const { next_cursor: next_next_cursor, channels } =
        await this.getImChannels();

      response = response.concat(channels);
      if (nextCursor === next_next_cursor) {
        // 이번에 조회했던 다음 커서 값이, 다음 페이지 조회 후 나온 커서와 동일할 경우 break.
        break;
      }

      nextCursor = next_next_cursor;

      console.log("nextCursor: ", nextCursor);
    } while (nextCursor);

    return response;
  }

  private async getImChannels(): Promise<ISlackService.IGetImChannelOutput> {
    const url = `https://slack.com/api/conversations.list?pretty=1`;
    const secretKey = this.props.secretKey;

    const queryParameter = createQueryParameter({ secretKey, types: "im" });

    const res = await axios.get(`${url}&${queryParameter}`, {
      headers: {
        Authorization: `Bearer ${this.props.secretKey}`,
        "Content-Type": "application/json; charset=utf-8;",
      },
    });

    const next_cursor = res.data.response_metadata?.next_cursor;
    const channels = res.data.channels;

    return { channels, next_cursor: next_cursor ? next_cursor : null }; // next_cursor가 빈 문자인 경우 대비
  }

  /**
   * Slack Service.
   *
   * get files in workspace
   *
   * You can look up Slack workspace and channels, or all files sent from users.
   * It is pagenation and can filter by file type, and also provides thumbnail links, download links, and original message links.
   */
  async getFiles(
    input: ISlackService.IGetFileInput,
  ): Promise<ISlackService.IGetFileOutput> {
    const url = `https://slack.com/api/files.list`;
    const queryParameters = createQueryParameter({
      channel: input.channel,
      count: input.limit,
      page: input.page,
      ...(input.latestDateTime && {
        ts_to: this.transformDateTimeToTs(input.latestDateTime),
      }),
      ...(input.oldestDateTime && {
        ts_from: this.transformDateTimeToTs(input.oldestDateTime),
      }),
      ...(input.types && {
        types: Object.entries(input.types)
          .filter(([_key, value]) => value === true)
          .map(([key]) => key)
          .join(","),
      }),
      user: input.user,
    });

    const res = await axios.get(`${url}?${queryParameters}`, {
      headers: {
        Authorization: `Bearer ${this.props.secretKey}`,
        "Content-Type": "application/json; charset=utf-8;",
      },
    });

    return res.data;
  }

  /**
   * Slack Service.
   *
   * Send Slack Custom Template Messages for Voting
   */
  async vote(
    input: ISlackService.IHoldVoteInput,
  ): Promise<ISlackService.IHoldVoteOutput> {
    const client = new WebClient(this.props.secretKey);
    const auth = await client.auth.test();
    const user = await client.users.profile.get({ user: auth.user_id });

    const requester = user.profile?.display_name
      ? user.profile?.display_name
      : (user.profile?.real_name ?? "");

    const slackTemplateService = new SlackTemplateService({
      secretKey: this.props.secretKey,
    });

    const res = await client.chat.postMessage({
      channel: input.channel,
      blocks: slackTemplateService.voteTemplate({
        requester,
        title: input.title,
        items: input.items,
      }),
    });

    const ts = res.ts;
    if (ts) {
      return { ts, blocks: res.message?.blocks };
    }

    throw new Error("슬랙 템플릿 메시지 전송 실패");
  }

  /**
   * Slack Service.
   *
   *  get user groups in workspace
   *
   * Look up user groups. This can be used to call all specific groups by tagging.
   * However, it is difficult to know if it is an appropriate user group other than 'handle' because all internal users come out with IDs.
   * If you want to see a list of users, use the User Inquiry connector together.
   * If you want to see the user's nickname or name that corresponds to the user's ID, refer to the User Inquiry connector.
   */
  async getUserGroups(): Promise<ISlackService.IGetUserGroupOutput> {
    try {
      const url = `https://slack.com/api/usergroups.list?include_users=true`;

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.props.secretKey}`,
          "Content-Type": "application/json; charset=utf-8;",
        },
      });

      if (res.data.ok === false) {
        // Missing scope error
        throw new Error(JSON.stringify(res.data));
      }

      return res.data;
    } catch (err) {
      return { usergroups: [], ok: false };
    }
  }

  private getUserProfileFields(profile: { fields: Record<string, string> }) {
    if (profile?.fields) {
      const fields = Object.values(profile.fields)
        .map((el: any) => {
          return { [el.label]: el.value };
        })
        .reduce((acc, cur) => Object.assign(acc, cur), {});

      return fields;
    }

    return {};
  }

  private transformTsToTimestamp(ts: string) {
    const timestampString = ts.split(".").at(0) + "000";
    const timestamp = Number(timestampString);
    return timestamp;
  }

  private transformDateTimeToTs(dateTime: string & tags.Format<"date-time">) {
    const timestamp = new Date(dateTime).getTime();
    return this.transformTimestampToTs(timestamp);
  }

  private transformTimestampToTs(timestamp: number) {
    return String(timestamp).split("").slice(0, -3).join("");
  }

  private convertMessageFormat(input: {
    message: PickPartial<
      ISlackService.Message,
      "reply_count" | "reply_users_count"
    >;
    channel: ISlackService.Channel["id"];
    link_count: number;
    allMembers: StrictOmit<ISlackService.IGetUserOutput, "fields">[];
    allUsergroups: ISlackService.UserGroup[];
    workspaceUrl: string & tags.Format<"uri">;
  }): ISlackService.ChannelHistory {
    function extractLinks(text: string): string[] {
      // URL 패턴을 찾는 정규식
      /**
       * <LINK|ALT>에서 LINK만 뽑도록 정의한 RegExp
       */
      const linkRegex = /(?<=<)https?:\/\/[^>|]+(?=>|)/g;

      // 입력 문자열에서 URL을 추출
      const links = text.match(linkRegex);

      // 링크가 없다면 빈 문자열 반환
      return links ? Array.from(new Set(links)) : [];
    }

    const timestamp = this.transformTsToTimestamp(input.message.ts);
    const speaker = input.allMembers.find((el) => el.id === input.message.user);
    const links = extractLinks(input.message.text);
    return {
      // type: input.message.type,
      user: input.message.user ?? null,
      username: speaker?.display_name ?? null,
      user_profile: speaker?.profile_image ?? null,
      text: input.message.text
        .replaceAll(/```[\s\S]+?```/g, "<CODE/>")
        .replaceAll(/<https?:\/\/[^\>]+>/g, () => {
          return `<LINK${input.link_count++}/>`;
        })
        .replace(/<!subteam\^(\w+)>/g, (_, id) => {
          const usergroup = input.allUsergroups.find(
            (usergroup) => usergroup.id === id,
          );
          return usergroup ? `@${usergroup.handle}` : `@${id}`; // 멤버가 없으면 원래 아이디를 유지
        })
        .replace(/@(\w+)/g, (_, id) => {
          const member = input.allMembers.find((member) => member.id === id);
          return member ? `@${member.name}` : `@${id}`; // 멤버가 없으면 원래 아이디를 유지
        }),
      links,
      ts: String(input.message.ts),
      channel: input.channel,
      reply_count: input.message?.reply_count ?? 0,
      reply_users_count: input.message?.reply_users_count ?? 0,
      ts_date: new Date(timestamp).toISOString(),
      link: `${input.workspaceUrl}archives/${input.channel}/p${input.message.ts.replace(".", "")}`,
      // usergroups,
      // ...(input.message.attachments && { attachments: input.message.attachments }),
    };
  }

  async getOneSlackUserDetail(
    input: ISlackService.GetOneSlackUserDetailInput,
  ): Promise<ISlackService.GetOneSlackUserDetailOutput> {
    const url = `https://slack.com/api/users.profile.get?include_labels=true&user=${input.external_user_id}`;

    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.props.secretKey}`,
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8;",
        },
      });

      if (typia.is<{ ok: false; error: "ratelimited" }>(res.data)) {
        throw new Error(res.data.error);
      }

      const fields = this.getUserProfileFields(res.data.profile);
      return {
        ...res.data.profile,
        slack_team_id: res.data.team_id,
        profile_image: res.data.profile.image_original ?? null,
        fields,
      };
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Slack Service.
   *
   * Get Requester's Information
   *
   * You can use that function to get requester's information.
   * If you want to get information about requester, call this function.
   * Then you can use that information wherever you need requester's information.
   */
  async getMyInfo(): Promise<ISlackService.IGetMyInfoOutput> {
    const url = `https://slack.com/api/auth.test`;

    try {
      const res = await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${this.props.secretKey}`,
            "Content-Type": "application/json; charset=utf-8",
          },
        },
      );

      const auth: {
        team: string;
        team_id: string;
        user: string;
        user_id: string;
      } = res.data;

      if (!res.data.ok) {
        throw new Error(res.data.error ?? "Get Info does not work.");
      }

      return {
        user: {
          name: auth.user,
          user_id: auth.user_id,
          team: auth.team,
          team_id: auth.team_id,
        },
      };
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Slack Service.
   *
   * Delete Messages
   *
   * You must strictly distinguish between the requester's information and other's information. Always verify whether the information being requested pertains to the requester or someone else.
   * Before you call this function, you must call the function that gets requester's information.
   * You must only use requester's information to delete messages.
   * You must strictly filter the messages you delete to only those that match the requester's `User ID`
   * You must look through all the messages and only delete the ones that match the requester's user id.
   * Don't read one message and stop working on it because it has a different user id of requester.
   * To delete messages,
   * You need the timestamps of the messages you wrote that you want to delete and channel id.
   */
  async deleteMessage(input: ISlackService.IDeleteMessageInput): Promise<void> {
    const url = `https://slack.com/api/chat.delete`;

    const fetch = async (
      message: ISlackService.IDeleteMessageInput["messages"][0],
    ) => {
      try {
        const res = await axios.post(
          url,
          {
            channel: message.channel,
            ts: message.ts,
            as_user: true,
          },
          {
            headers: {
              Authorization: `Bearer ${this.props.secretKey}`,
              "Content-Type": "application/json; charset=utf-8;",
            },
          },
        );

        if (!res.data.ok) {
          throw new Error(res.data.error ?? "Deleting message does not work.");
        }
      } catch (err) {
        console.error(JSON.stringify(err));
        throw err;
      }
    };

    for (const message of input.messages) {
      await retry(() => fetch(message))();
    }

    return;
  }

  private extract(target: "usergroup") {
    if (target === "usergroup") {
      return function (input: {
        response: Pick<ISlackService.Message, "text">[];
        allUserGroup: ISlackService.UserGroup[];
      }): ISlackService.UserGroup[] {
        const refinedTags = Array.from(
          new Set(
            ...input.response.flatMap((message) => {
              const tags = message.text.match(/<!subteam\^\w+>/g);
              const refinedTags: string[] = tags
                ? Array.from(new Set(tags))
                : [];
              return refinedTags;
            }),
          ),
        );
        const includedUsergroups = input.allUserGroup.filter((usergroup) => {
          return refinedTags.includes(`<!subteam^${usergroup.id}>`);
        });

        return includedUsergroups;
      };
    }

    throw new Error("invalid target.");
  }

  private async getAllUsers(): Promise<
    Awaited<ReturnType<typeof this.getUsers>>["users"]
  > {
    let nextCursor: string | null = null;
    let response: Awaited<ReturnType<typeof this.getUsers>>["users"] = [];
    do {
      const { next_cursor, users } = await this.getUsers({
        ...(nextCursor ? { cursor: nextCursor } : {}),
        limit: 1000,
      });

      response = response.concat(users);
      nextCursor = next_cursor;
    } while (nextCursor);

    return response;
  }
}
