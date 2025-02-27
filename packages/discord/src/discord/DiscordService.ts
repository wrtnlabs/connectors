import axios from "axios";
import { IDiscordService } from "../structures/IDiscordService";

export class DiscordService {
  constructor(private readonly props: IDiscordService.IProps) {}

  async getListGuildMembers(): Promise<IDiscordService.IGuildMember[]> {
    try {
      const guildId = this.getGuildInfo();
      const res = await axios.get(
        `https://discord.com/api/v10/guilds/${guildId}/members`,
        {
          headers: {
            Authorization: `Bot ${this.props.secret}`,
          },
        },
      );
      return res.data;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  async createDM(
    input: IDiscordService.ICreateDMRequest,
  ): Promise<IDiscordService.IChannel> {
    try {
      const res = await axios.post(
        "https://discord.com/api/v10/users/@me/channels",
        {
          recipient_id: input.recipient_id,
        },
        {
          headers: {
            Authorization: `Bot ${this.props.secret}`,
          },
        },
      );

      return res.data;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  async modifyGuild(
    input: IDiscordService.IModifyGuildRequest,
  ): Promise<IDiscordService.IGuild> {
    try {
      const guildId = this.getGuildInfo();
      const res = await axios.patch(
        `https://discord.com/api/v10/guilds/${guildId}`,
        {
          name: input.name,
        },
        {
          headers: {
            Authorization: `Bot ${this.props.secret}`,
          },
        },
      );
      return res.data;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  async getGuildChannels(): Promise<IDiscordService.IChannel[]> {
    try {
      const guildId = this.getGuildInfo();
      const res = await axios.get(
        `https://discord.com/api/v10/guilds/${guildId}/channels`,
        {
          headers: {
            Authorization: `Bot ${this.props.secret}`,
          },
        },
      );
      return res.data;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  async createGuildChannel(
    input: IDiscordService.ICreateGuildChannelRequest,
  ): Promise<IDiscordService.IChannel> {
    try {
      const guildId = this.getGuildInfo();
      const res = await axios.post(
        `https://discord.com/api/v10/guilds/${guildId}/channels`,
        {
          name: input.name,
          type: input.type,
          ...(input.topic && { topic: input.topic }),
        },
        {
          headers: {
            Authorization: `Bot ${this.props.secret}`,
          },
        },
      );
      return res.data;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  async removeGuildMember(
    input: IDiscordService.IRemoveGuildMember,
  ): Promise<void> {
    try {
      const guildId = this.getGuildInfo();
      await axios.delete(
        `https://discord.com/api/v10/guilds/${guildId}/members/${input.userId}`,
        {
          headers: {
            Authorization: `Bot ${this.props.secret}`,
          },
        },
      );
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Channel
   */
  async modifyChannel(
    input: IDiscordService.IModifyChannelRequest,
  ): Promise<IDiscordService.IChannel> {
    try {
      const res = await axios.patch(
        `https://discord.com/api/v10/channels/${input.channelId}`,
        {
          name: input.name,
        },
        {
          headers: {
            Authorization: `Bot ${this.props.secret}`,
          },
        },
      );
      return res.data;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  async deleteChannel(
    input: IDiscordService.IDeleteChannelRequest,
  ): Promise<void> {
    try {
      await axios.delete(
        `https://discord.com/api/v10/channels/${input.channelId}`,
        {
          headers: {
            Authorization: `Bot ${this.props.secret}`,
          },
        },
      );
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  async getPinnedMessages(
    input: IDiscordService.IGetPinnedMessagesRequest,
  ): Promise<IDiscordService.IMessage[]> {
    try {
      const res = await axios.get(
        `https://discord.com/api/v10/channels/${input.channelId}/pins`,
        {
          headers: {
            Authorization: `Bot ${this.props.secret}`,
          },
        },
      );
      return res.data;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  async pinMessage(
    input: IDiscordService.IPinOrUnpinMessagesRequest,
  ): Promise<void> {
    try {
      await axios.put(
        `https://discord.com/api/v10/channels/${input.channelId}/pins/${input.messageId}`,
        {},
        {
          headers: {
            Authorization: `Bot ${this.props.secret}`,
          },
        },
      );
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  async unpinMessage(
    input: IDiscordService.IPinOrUnpinMessagesRequest,
  ): Promise<void> {
    try {
      await axios.delete(
        `https://discord.com/api/v10/channels/${input.channelId}/pins/${input.messageId}`,
        {
          headers: {
            Authorization: `Bot ${this.props.secret}`,
          },
        },
      );
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Message
   */
  async getChannelMessageHistories(
    input: IDiscordService.IGetChannelMessageHistoriesRequest,
  ): Promise<IDiscordService.IMessage[]> {
    const messages: IDiscordService.IMessage[] = [];
    const limit: number = 100;
    const before = null;

    let hasMoreMessages = true;
    let lastMessageId = before;

    try {
      while (hasMoreMessages) {
        const res = await axios.get(
          `https://discord.com/api/v10/channels/${input.channelId}/messages`,
          {
            headers: {
              Authorization: `Bot ${this.props.secret}`,
            },
            params: {
              limit,
              before: lastMessageId,
            },
          },
        );

        const fetchedMessages = res.data;
        if (fetchedMessages.length === 0) {
          hasMoreMessages = false; // 더 이상 메시지가 없을 경우 종료
        } else {
          messages.push(...fetchedMessages);
          lastMessageId = fetchedMessages[fetchedMessages.length - 1].id; // 가장 마지막 메시지의 ID 저장
        }
      }

      return messages;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  async createMessage(
    input: IDiscordService.ICreateMessageRequest,
  ): Promise<IDiscordService.IMessage> {
    try {
      const res = await axios.post(
        `https://discord.com/api/v10/channels/${input.channelId}/messages`,
        {
          content: input.content,
        },
        {
          headers: {
            Authorization: `Bot ${this.props.secret}`,
          },
        },
      );
      return res.data;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  async editMessage(
    input: IDiscordService.IEditMessageRequest,
  ): Promise<IDiscordService.IMessage> {
    try {
      const res = await axios.patch(
        `https://discord.com/api/v10/channels/${input.channelId}/messages/${input.messageId}`,
        {
          content: input.content,
        },
        {
          headers: {
            Authorization: `Bot ${this.props.secret}`,
          },
        },
      );
      return res.data;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  async deleteMessage(
    input: IDiscordService.IDeleteMessageRequest,
  ): Promise<void> {
    try {
      await axios.delete(
        `https://discord.com/api/v10/channels/${input.channelId}/messages/${input.messageId}`,
        {
          headers: {
            Authorization: `Bot ${this.props.secret}`,
          },
        },
      );
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  async bulkDeleteMessages(
    input: IDiscordService.IBulkDeleteMessagesRequest,
  ): Promise<void> {
    try {
      await axios.post(
        `https://discord.com/api/v10/channels/${input.channelId}/messages/bulk-delete`,
        {
          messages: input.messages,
        },
        {
          headers: {
            Authorization: `Bot ${this.props.secret}`,
          },
        },
      );
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  async getGuildIds(): Promise<IDiscordService.IGetGuildIdsOutput> {
    const res = await axios.get(
      `https://discord.com/api/v10/users/@me/guilds`,
      {
        headers: {
          Authorization: `Bot ${this.props.secret}`,
        },
      },
    );

    return {
      guildIds: res.data,
    };
  }

  /**
   * Discord's OAuth Bot user 사용.
   * guild 정보를 secret으로 받아옴.
   */
  private getGuildInfo(): string {
    return this.props.guildId;
  }
}
