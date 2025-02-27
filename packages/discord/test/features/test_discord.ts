import { DiscordService } from "@wrtnlabs/connector-discord";
import typia from "typia";
import { TestGlobal } from "../TestGlobal";

export const test_discord = async () => {
  const discordService = new DiscordService({
    secret: TestGlobal.env.DISCORD_BOT_TOKEN,
    guildId: "1260868337467129989",
  });

  const guildIds = await discordService.getGuildIds();

  typia.assert(guildIds);

  /**
   * Modify Guild
   */
  try {
    const modifyGuild = await discordService.modifyGuild({
      name: "뤼튼 스튜디오 길드",
    });
    typia.assert(modifyGuild);
  } catch (e) {
    console.error(JSON.stringify(e));
    throw e;
  }

  /**
   * Get Guild Channels
   */
  const channels = await discordService.getGuildChannels();
  typia.assert(channels);

  // /**
  //  * Get list Guild Members
  //  *
  //  * Cannot Bot
  //  */
  // const members =
  //   await discordService.getListGuildMembers(
  //
  //     {
  //     },
  //   );
  // typia.assert(members);

  // /**
  //  * Create DM Channel
  //  *
  //  * Wait
  //  */
  // const dmChannel = await discordService.createDM(
  //
  //   {
  //     recipient_id: members[0].user!.id,
  //   },
  // );
  // typia.assert(dmChannel);

  // /**
  //  * Remove Guild Member
  //  *
  //  * Wait
  //  */
  // const removeMember =
  //   await discordService.removeGuildMember(
  //
  //     {
  //       userId: members[1].user!.id,
  //     },
  //   );
  // typia.assert(removeMember);

  /**
   * Create Guild Channel
   */
  const createChannel = await discordService.createGuildChannel({
    name: "스튜디오 채널",
    type: 0,
  });
  typia.assert(createChannel);

  const channelId = createChannel.id;

  /**
   * Modify Guild Channel
   */
  const modifyChannel = await discordService.modifyChannel({
    channelId: channelId,
    name: "스튜디오 채널2",
  });
  typia.assert(modifyChannel);

  /**
   * Get Pinned Messages
   */
  const pinnedMessages = await discordService.getPinnedMessages({
    channelId: channelId,
  });
  typia.assert(pinnedMessages);

  /**
   * Get Channel Message Histories
   */
  const messageHistories = await discordService.getChannelMessageHistories({
    channelId: "1260868337467129996",
  });
  typia.assert(messageHistories);

  /**
   * Send Message
   */
  const sendMessage = await discordService.createMessage({
    channelId: "1260868337467129996",
    content: "안녕하세요!",
  });
  typia.assert(sendMessage);

  /**
   * Pin Message
   */
  const pinMessage = await discordService.pinMessage({
    channelId: "1260868337467129996",
    messageId: sendMessage.id,
  });
  typia.assert(pinMessage);

  /**
   * Unpin Message
   */
  const unpinMessage = await discordService.unpinMessage({
    channelId: "1260868337467129996",
    messageId: sendMessage.id,
  });
  typia.assert(unpinMessage);

  /**
   * Modify Message
   */
  const modifyMessage = await discordService.editMessage({
    channelId: "1260868337467129996",
    messageId: sendMessage.id,
    content: "안녕하세요2!",
  });
  typia.assert(modifyMessage);

  /**
   * Delete Message
   */
  const deleteMessage = await discordService.deleteMessage({
    channelId: "1260868337467129996",
    messageId: sendMessage.id,
  });
  typia.assert(deleteMessage);

  const sendMessageForBulkDeleteOne = await discordService.createMessage({
    channelId: "1260868337467129996",
    content: "안녕하세요!",
  });
  typia.assert(sendMessage);

  const sendMessageForBulkDeleteTwo = await discordService.createMessage({
    channelId: "1260868337467129996",
    content: "안녕하세요!",
  });
  typia.assert(sendMessage);

  /**
   * Bulk Delete Message
   */
  const bulkDeleteMessage = await discordService.bulkDeleteMessages({
    channelId: "1260868337467129996",
    messages: [sendMessageForBulkDeleteOne.id, sendMessageForBulkDeleteTwo.id],
  });
  typia.assert(bulkDeleteMessage);

  /**
   * Delete Guild Channel
   */
  const deleteChannel = await discordService.deleteChannel({
    channelId: channelId,
  });
  typia.assert(deleteChannel);
};
