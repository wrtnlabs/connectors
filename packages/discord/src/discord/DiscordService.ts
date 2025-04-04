import axios from "axios";
import { IDiscordService } from "../structures/IDiscordService";

export class DiscordService {
  constructor(private readonly props: IDiscordService.IProps) {}

  /**
   * Discord Service.
   *
   * Get a list of members on the server
   *
   */
  async getListGuildMembers(
    input: IDiscordService.IGetListGuildMembersInput,
  ): Promise<IDiscordService.IGuildMember[]> {
    try {
      const res = await axios.get(
        `https://discord.com/api/v10/guilds/${input.guildId}/members`,
        {
          headers: {
            Authorization: `Bot ${this.props.discordToken}`,
          },
        },
      );
      return res.data;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Discord Service.
   *
   * Create a new DM channel
   *
   */
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
            Authorization: `Bot ${this.props.discordToken}`,
          },
        },
      );

      return res.data;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Discord Service.
   *
   * Modify server information
   *
   */
  async modifyGuild(
    input: IDiscordService.IModifyGuildRequest,
  ): Promise<IDiscordService.IGuild> {
    try {
      const res = await axios.patch(
        `https://discord.com/api/v10/guilds/${input.guildId}`,
        {
          name: input.name,
        },
        {
          headers: {
            Authorization: `Bot ${this.props.discordToken}`,
          },
        },
      );
      return res.data;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Discord Service.
   *
   * Get a list of channels on the server
   *
   */
  async getGuildChannels(
    input: IDiscordService.IGetGuildChannelsInput,
  ): Promise<IDiscordService.IChannel[]> {
    try {
      const res = await axios.get(
        `https://discord.com/api/v10/guilds/${input.guildId}/channels`,
        {
          headers: {
            Authorization: `Bot ${this.props.discordToken}`,
          },
        },
      );
      return res.data;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Discord Service.
   *
   * Create a new channel on the server
   *
   */
  async createGuildChannel(
    input: IDiscordService.ICreateGuildChannelRequest,
  ): Promise<IDiscordService.IChannel> {
    try {
      const res = await axios.post(
        `https://discord.com/api/v10/guilds/${input.guildId}/channels`,
        {
          name: input.name,
          type: input.type,
          ...(input.topic && { topic: input.topic }),
        },
        {
          headers: {
            Authorization: `Bot ${this.props.discordToken}`,
          },
        },
      );
      return res.data;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Discord Service.
   *
   * Kicks selected members from the server
   *
   */
  async removeGuildMember(
    input: IDiscordService.IRemoveGuildMember,
  ): Promise<void> {
    try {
      await axios.delete(
        `https://discord.com/api/v10/guilds/${input.guildId}/members/${input.userId}`,
        {
          headers: {
            Authorization: `Bot ${this.props.discordToken}`,
          },
        },
      );
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Discord Service.
   *
   * Modify channel information
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
            Authorization: `Bot ${this.props.discordToken}`,
          },
        },
      );
      return res.data;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Discord Service.
   *
   * Delete the selected channel
   */
  async deleteChannel(
    input: IDiscordService.IDeleteChannelRequest,
  ): Promise<void> {
    try {
      await axios.delete(
        `https://discord.com/api/v10/channels/${input.channelId}`,
        {
          headers: {
            Authorization: `Bot ${this.props.discordToken}`,
          },
        },
      );
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Discord Service.
   *
   * Get a list of pinned messages in a channel
   */
  async getPinnedMessages(
    input: IDiscordService.IGetPinnedMessagesRequest,
  ): Promise<IDiscordService.IMessage[]> {
    try {
      const res = await axios.get(
        `https://discord.com/api/v10/channels/${input.channelId}/pins`,
        {
          headers: {
            Authorization: `Bot ${this.props.discordToken}`,
          },
        },
      );
      return res.data;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Discord Service.
   *
   * Pin a message to a channel
   *
   */
  async pinMessage(
    input: IDiscordService.IPinOrUnpinMessagesRequest,
  ): Promise<void> {
    try {
      await axios.put(
        `https://discord.com/api/v10/channels/${input.channelId}/pins/${input.messageId}`,
        {},
        {
          headers: {
            Authorization: `Bot ${this.props.discordToken}`,
          },
        },
      );
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Discord Service.
   *
   * Unpin a pinned message from a channel
   */
  async unpinMessage(
    input: IDiscordService.IPinOrUnpinMessagesRequest,
  ): Promise<void> {
    try {
      await axios.delete(
        `https://discord.com/api/v10/channels/${input.channelId}/pins/${input.messageId}`,
        {
          headers: {
            Authorization: `Bot ${this.props.discordToken}`,
          },
        },
      );
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Discord Service.
   *
   * Get the messages that exist in the channel
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
              Authorization: `Bot ${this.props.discordToken}`,
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

  /**
   * Discord Service.
   *
   * Send a message
   */
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
            Authorization: `Bot ${this.props.discordToken}`,
          },
        },
      );
      return res.data;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Discord Service.
   *
   * Modify the message
   */
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
            Authorization: `Bot ${this.props.discordToken}`,
          },
        },
      );
      return res.data;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Discord Service.
   *
   * Delete message
   */
  async deleteMessage(
    input: IDiscordService.IDeleteMessageRequest,
  ): Promise<void> {
    try {
      await axios.delete(
        `https://discord.com/api/v10/channels/${input.channelId}/messages/${input.messageId}`,
        {
          headers: {
            Authorization: `Bot ${this.props.discordToken}`,
          },
        },
      );
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Discord Service.
   *
   * Delete multiple messages
   */
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
            Authorization: `Bot ${this.props.discordToken}`,
          },
        },
      );
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Discord Service.
   *
   * Get the guild IDs of the user
   */
  async getGuildIds(): Promise<IDiscordService.IGetGuildIdsOutput> {
    const res = await axios.get(
      `https://discord.com/api/v10/users/@me/guilds`,
      {
        headers: {
          Authorization: `Bot ${this.props.discordToken}`,
        },
      },
    );

    return {
      guildIds: res.data,
    };
  }
}
