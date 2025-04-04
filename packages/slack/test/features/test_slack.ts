import { SlackService } from "@wrtnlabs/connector-slack";
import { TestGlobal } from "../TestGlobal";
import typia from "typia";
import assert from "assert";

export const test_slack_get_all_private_channels = async () => {
  const slackService = new SlackService({
    slackToken: TestGlobal.env.SLACK_TEST_SECRET,
  });
  const res = await slackService.getAllPrivateChannels();

  typia.assert(res);
  return res;
};

export const test_slack_get_all_public_channels = async () => {
  const slackService = new SlackService({
    slackToken: TestGlobal.env.SLACK_TEST_SECRET,
  });
  const res = await slackService.getAllPublicChannels();

  typia.assert(res);
  return res;
};

export const test_slack_get_all_im_channels = async () => {
  const slackService = new SlackService({
    slackToken: TestGlobal.env.SLACK_TEST_SECRET,
  });
  const res = await slackService.getAllImChannels();

  typia.assert(res);

  assert(res.every((el) => typeof el.username === "string"));
  return res;
};

export const test_slack_get_channel_histories = async () => {
  const slackService = new SlackService({
    slackToken: TestGlobal.env.SLACK_TEST_SECRET,
  });

  const channels = await test_slack_get_all_public_channels();

  const messages = await slackService.getChannelHistories({
    channel: channels.at(0)?.id as any,
  });

  typia.assert(messages);
  assert(typeof messages.usergroups.length === "number");
  assert(typeof messages.channel.name === "string");
  assert(
    messages.messages.every(
      (el) => typeof el.user_profile === "string" || el.user_profile === null,
    ),
  );
  assert(messages.members.every((el) => typeof el.im_channel_id === "string"));

  return messages;
};

export const test_slack_get_channel_histories_with_date_time = async () => {
  const slackService = new SlackService({
    slackToken: TestGlobal.env.SLACK_TEST_SECRET,
  });

  const channels = await test_slack_get_all_public_channels();

  const messages = await slackService.getChannelHistories({
    channel: channels.at(0)?.id as any,
    oldestDateTime: new Date("2024-08-30").toISOString(),
    latestDateTime: new Date("2024-08-31").toISOString(),
  });

  typia.assert(messages);
  return messages;
};

export const test_slack_send_text_message_to_im = async () => {
  const slackService = new SlackService({
    slackToken: TestGlobal.env.SLACK_TEST_SECRET,
  });

  const [imchannel] = await test_slack_get_all_im_channels();
  const message = await slackService.sendText({
    channel: imchannel?.id as any,
    text: "hello, imchannel and world",
  });

  await slackService.updateMessage({
    thread_ts: message.ts,
    channel: imchannel?.id as any,
    text: "hello, imchannel and world[updated]",
  });
};
