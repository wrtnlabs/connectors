import { Injectable } from "@nestjs/common";
import { ISlack } from "@wrtn/connector-api/lib/structures/connector/slack/ISlack";
import axios from "axios";

@Injectable()
export class SlackProvider {
  async getChannelHistories(
    input: ISlack.IGetChannelHistoryInput,
  ): Promise<ISlack.IGetChannelHistoryOutput> {
    const url = `https://slack.com/api/conversations.history?channel=C07ER9HLDGD&limit=30&pretty=1`;
    const { secretKey, ...rest } = input;
    const queryParameter = Object.entries({ ...rest, type: "private_channel" })
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    const res = await axios.get(`${url}&${queryParameter}`, {
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    });

    const next_cursor = res.data.response_metadata.next_coursor;
    const messages = res.data.messages.map((message: ISlack.Message) => {
      return {
        type: message.type,
        user: message.user,
        text: message.user,
        ts: message.ts,
        ...(message.attachments && { attachments: message.attachments }),
      };
    });

    return { messages, next_cursor };
  }

  async getPrivateChannels(
    input: ISlack.IGetChannelInput,
  ): Promise<ISlack.IGetPrivateChannelOutput> {
    const url = `https://slack.com/api/conversations.list?pretty=1`;
    const { secretKey, ...rest } = input;
    const queryParameter = Object.entries({ ...rest, type: "private_channel" })
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    const res = await axios.get(`${url}&${queryParameter}`, {
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    });

    const next_cursor = res.data.response_metadata.next_coursor;
    const channels = res.data.channels.map((channel: ISlack.PrivateChannel) => {
      return {
        id: channel.id,
        name: channel.name,
      };
    });
    return { channels, next_cursor };
  }

  async getPublicChannels(
    input: ISlack.IGetChannelInput,
  ): Promise<ISlack.IGetPublicChannelOutput> {
    const url = `https://slack.com/api/conversations.list?pretty=1`;
    const { secretKey, ...rest } = input;
    const queryParameter = Object.entries({ ...rest, type: "public_channel" })
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    const res = await axios.get(`${url}&${queryParameter}`, {
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    });

    const next_cursor = res.data.response_metadata.next_coursor;
    const channels = res.data.channels.map((channel: ISlack.PublicChannel) => {
      return {
        id: channel.id,
        name: channel.name,
      };
    });
    return { channels, next_cursor };
  }

  async getImChannels(
    input: ISlack.IGetChannelInput,
  ): Promise<ISlack.IGetImChannelOutput> {
    const url = `https://slack.com/api/conversations.list?pretty=1`;
    const { secretKey, ...rest } = input;
    const queryParameter = Object.entries({ ...rest, type: "im" })
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    const res = await axios.get(`${url}&${queryParameter}`, {
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    });

    const next_cursor = res.data.response_metadata.next_coursor;
    const channels = res.data.channels;

    return { channels, next_cursor };
  }
}
