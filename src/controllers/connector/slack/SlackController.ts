import { TypedBody, TypedRoute } from "@nestia/core";
import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ISlack } from "@wrtn/connector-api/lib/structures/connector/slack/ISlack";
import { MyPick } from "@wrtn/connector-api/lib/structures/types/MyPick";
import { RouteIcon } from "@wrtnio/decorators";
import { SlackProvider } from "../../../providers/connector/slack/SlackProvider";
import { retry } from "../../../utils/retry";
@Controller("connector/slack")
export class SlackController {
  constructor(private readonly slackProvider: SlackProvider) {}

  /**
   * @hidden
   * @param input
   * @returns array of slack block types
   */
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/slack.svg",
  )
  @ApiTags("Slack")
  @Post("interactivity")
  async interactivity(@Body() input: ISlack.Payload): Promise<any[]> {
    const parsed: ISlack.InteractiveComponent = JSON.parse(input.payload);
    return await this.slackProvider.interactivity({ payload: parsed });
  }

  /**
   * Send Slack Custom Template Messages for Voting
   *
   * @summary Send Slack Custom Template Messages for Voting
   * @param input
   * @returns
   */
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/slack.svg",
  )
  @ApiTags("Slack")
  @TypedRoute.Post("vote")
  async vote(
    @TypedBody() input: ISlack.IHoldVoteInput,
  ): Promise<ISlack.IHoldVoteOutput> {
    return retry(() => this.slackProvider.vote(input))();
  }

  /**
   * Marks a specific message in a Slack channel as read
   *
   * You need to know both the channel ID and the ts value of the message.
   *
   * @summary Marks a specific message in a Slack channel as read
   * @param input
   */
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/slack.svg",
  )
  @ApiTags("Slack")
  @TypedRoute.Post("conversation/mark")
  async mark(@TypedBody() input: ISlack.IMarkInput): Promise<void> {
    return retry(() => this.slackProvider.mark(input))();
  }

  /**
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
   *
   * @param input
   * @returns scheduled message
   */
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/slack.svg",
  )
  @ApiTags("Slack")
  @TypedRoute.Post("scheduleMessage/text")
  async sendScheduleMessage(
    @TypedBody() input: ISlack.ISCheduleMessageInput,
  ): Promise<MyPick<ISlack.ScheduledMessage, "post_at">> {
    return retry(() => this.slackProvider.sendScheduleMessage(input))();
  }

  /**
   * Delete the scheduled message
   *
   * To clear a scheduled message,
   * you must get the exact id of that message, so you must first use the scheduled message lookup connector.
   * When using this connector,
   * the ID of the channel is also required, which can be retrieved from the message object by querying the channel or by querying the scheduled message.
   *
   * @summary Delete the scheduled message
   * @param input
   */
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/slack.svg",
  )
  @ApiTags("Slack")
  @TypedRoute.Delete("scheduleMessage")
  async deleteScheduleMessage(
    @TypedBody() input: ISlack.IDeleteSCheduleMessageInput,
  ): Promise<void> {
    return retry(() => this.slackProvider.deleteScheduleMessage(input))();
  }

  /**
   * send message to myself
   *
   * Here, you can send a message as long as you have the message.
   * This feature identifies who the token's users are inside and sends a message to themselves.
   * Therefore, even if you don't specify a channel,
   * you send a message to the `im` channel that corresponds to your own user id.
   *
   * @summary post text message to myself
   * @param input
   * @returns created message
   */
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/slack.svg",
  )
  @ApiTags("Slack")
  @TypedRoute.Post("postMessage/text/myself")
  async sendTextToMyself(
    @TypedBody() input: ISlack.IPostMessageToMyselfInput,
  ): Promise<MyPick<ISlack.Message, "ts">> {
    return retry(() => this.slackProvider.sendTextToMyself(input))();
  }

  /**
   * send reply message to thread
   *
   * Creates a reply.
   * To reply, you must first look up the thread.
   * You can look up the thread and pass on the 'ts' value of that thread.
   * You still need the channel's ID here.
   * The channel's ID will start with a C or D and be an unknown string,
   * not a natural language name recognized by the user.
   * Therefore, if you don't know the channel ID, you should also look up the channel.
   *
   * @summary post reply message to thread
   * @param input
   * @returns created message
   */
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/slack.svg",
  )
  @ApiTags("Slack")
  @TypedRoute.Post("postMessage/reply")
  async sendReply(
    @TypedBody() input: ISlack.IPostMessageReplyInput,
  ): Promise<MyPick<ISlack.Message, "ts">> {
    return retry(() => this.slackProvider.sendReply(input))();
  }

  /**
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
   *
   * @summary post text message
   * @param input
   * @returns created message
   */
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/slack.svg",
  )
  @ApiTags("Slack")
  @TypedRoute.Post("postMessage/text")
  async sendText(
    @TypedBody() input: ISlack.IPostMessageInput,
  ): Promise<MyPick<ISlack.Message, "ts">> {
    return retry(() => this.slackProvider.sendText(input))();
  }

  /**
   * Update message body
   *
   * Use to modify messages sent by users.
   * If the message is not sent by the user, user cannot modify it.
   *
   * @summary Update message body in thread
   * @param input
   * @returns
   */
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/slack.svg",
  )
  @ApiTags("Slack")
  @TypedRoute.Put("message")
  async updateMessage(
    @TypedBody() input: ISlack.IUpdateMessageInput,
  ): Promise<ISlack.IUpdateMessageOutput> {
    return retry(() => this.slackProvider.updateMessage(input))();
  }

  /**
   * Get a list of scheduled messages
   *
   * Look up the messages you booked.
   * You can use `post_at` and `post_at_date` to find out when the message will be sent.
   * If you want to clear the message, use the `id` value in the scheduled message.
   *
   * If a user wants to send a reservation message to himself,
   * he or she should look up both the user and the 'im' channel, then find the 'im' channel with his or her user ID and send it to that channel.
   * What is on the 'im' channel includes not only the user's own channel, but also all the channels that can send and receive direct messages for each user.
   *
   * @summary Get a list of scheduled messages
   * @param input
   * @returns
   */
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/slack.svg",
  )
  @ApiTags("Slack")
  @TypedRoute.Patch("get-scheduled-messages")
  async getScheduledMessages(
    @TypedBody() input: ISlack.IGetScheduledMessageListInput,
  ): Promise<ISlack.IGetScheduledMessageListOutput> {
    return retry(() => this.slackProvider.getScheduledMessages(input))();
  }

  /**
   * Inquire user details
   *
   * Inquire the user's detailed profile to acquire information such as phone number, email, and position.
   * It cannot be verified if the user has not filled in.
   * This function receives the user's ID in an array and inquires at once.
   *
   * @summary Inquire user details
   * @param input
   * @returns
   */
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/slack.svg",
  )
  @ApiTags("Slack")
  @TypedRoute.Patch("get-user-details")
  async getUserDetails(
    @TypedBody() input: ISlack.IGetUserDetailInput,
  ): Promise<ISlack.IGetUserDetailOutput[]> {
    return retry(() => this.slackProvider.getUserDetails(input), 1)();
  }

  /**
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
   *
   * @param input
   * @returns Users
   */
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/slack.svg",
  )
  @ApiTags("Slack")
  @TypedRoute.Patch("get-users")
  async getUsers(
    @TypedBody() input: ISlack.IGetUserListInput,
  ): Promise<ISlack.IGetUserListOutput> {
    return retry(() => this.slackProvider.getUsers(input))();
  }

  /**
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
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/slack.svg",
  )
  @ApiTags("Slack")
  @TypedRoute.Patch("get-replies")
  async getReplies(
    @TypedBody() input: ISlack.IGetReplyInput,
  ): Promise<ISlack.IGetReplyOutput> {
    return retry(() => this.slackProvider.getReplies(input))();
  }

  /**
   * Get Channel Links from Channel Histories
   *
   * Retrieves conversations in and out of channels.
   * A channel ID starts with 'C' or 'D' (uppercase). If no ID is provided, search by channel name or keywords.
   * Users often don’t know channel IDs, so prioritize finding the channel unless the input starts with 'C' or 'D'.
   * Search conversations within specific timeframes using datetime formats.
   * Filters out messages without links, retaining only those with links in the links property.
   * This ensures efficient link extraction from conversation histories.
   *
   * @summary get links from channel histories
   * @param input
   * @returns
   */
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/slack.svg",
  )
  @ApiTags("Slack")
  @TypedRoute.Patch("get-channel-link-histories")
  async getChannelLinkHistories(
    @TypedBody() input: ISlack.IGetChannelHistoryInput,
  ): Promise<ISlack.IGetChannelLinkHistoryOutput> {
    return retry(() => this.slackProvider.getChannelLinkHistories(input))();
  }

  /**
   * Get Channel Histories
   *
   * Retrieves conversations in and out of channels.
   * Channel IDs start with 'C' or 'D' (uppercase). If no ID is provided, search by channel name or keywords.
   * Users typically don’t know channel IDs, so prioritize finding the channel unless the input starts with 'C' or 'D'.
   * Search conversations within specific timeframes using datetime formats.
   * In history, links and code boxes are shown as <LINK/> and <CODE/>. Mentions appear as <@USERNAME>, but this indicates a mention, not the conversation starter.
   * Filters by date should prioritize the datetime format for accuracy.
   *
   * @summary get channel histories
   * @param input
   * @returns channel histories
   */
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/slack.svg",
  )
  @ApiTags("Slack")
  @TypedRoute.Patch("get-channel-histories")
  async getChannelHistories(
    @TypedBody() input: ISlack.IGetChannelHistoryInput,
  ): Promise<ISlack.IGetChannelHistoryOutput> {
    return retry(() => this.slackProvider.getChannelHistories(input))();
  }

  /**
   * get private channels
   *
   * View channels.
   * This connector will only look up its own `private` channel.
   * The channel ID is required to look up the conversation history within the channel later.
   * `private` channel is a locked channel that can only be viewed by those invited to the channel.
   *
   * If you can't find the channel ID by name, it might be because it's on the next page, not because you don't have a channel.
   *
   * @summary get private channels
   * @param input
   * @returns private channels
   */
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/slack.svg",
  )
  @ApiTags("Slack")
  @TypedRoute.Patch("get-private-channels")
  async getPrivateChannels(
    @TypedBody() input: ISlack.IGetChannelInput,
  ): Promise<ISlack.IGetPrivateChannelOutput["channels"]> {
    return retry(() => this.slackProvider.getAllPrivateChannels(input))();
  }

  /**
   * get public channels
   *
   * View channels.
   * This connector will only look up its own `public` channel.
   * The channel ID is required to look up the conversation history within the channel later.
   * The `public` channel is anyone's accessible.
   * This does not require an invitation process, and users can join the channel themselves if necessary.
   *
   * @summary get public channels
   * @param input
   * @returns public channels
   */
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/slack.svg",
  )
  @ApiTags("Slack")
  @TypedRoute.Patch("get-public-channels")
  async getPublicChannels(
    @TypedBody() input: ISlack.IGetChannelInput,
  ): Promise<ISlack.IGetPublicChannelOutput["channels"]> {
    return retry(() => this.slackProvider.getAllPublicChannels(input))();
  }

  /**
   * get im channels
   *
   * View channels.
   * This connector will only look up its own `im` channel.
   * The channel ID is required to look up the conversation history within the channel later.
   * `im` channel is a conversation that takes place in one's profile and refers to a personal channel that can only be viewed by oneself.
   * Users also use chat as storage or notepad, such as storing files and images here.
   *
   * To send a 1:1 message to other users, you must first look up the `im` channel.
   *
   * @summary get im channels
   * @param input
   * @returns im channels
   */
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/slack.svg",
  )
  @ApiTags("Slack")
  @TypedRoute.Patch("get-im-channels")
  async getImChannels(
    @TypedBody() input: ISlack.IGetChannelInput,
  ): Promise<ISlack.IGetImChannelOutput["channels"]> {
    return retry(() => this.slackProvider.getAllImChannels(input))();
  }

  /**
   * get files in workspace
   *
   * You can look up Slack workspace and channels, or all files sent from users.
   * It is pagenation and can filter by file type, and also provides thumbnail links, download links, and original message links.
   *
   * @summary get files in workspace
   * @param input
   */
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/slack.svg",
  )
  @ApiTags("Slack")
  @TypedRoute.Patch("get-files")
  async getFiles(
    @TypedBody() input: ISlack.IGetFileInput,
  ): Promise<ISlack.IGetFileOutput> {
    return retry(() => this.slackProvider.getFiles(input))();
  }

  /**
   * get user groups in workspace
   *
   * Look up user groups. This can be used to call all specific groups by tagging.
   * However, it is difficult to know if it is an appropriate user group other than 'handle' because all internal users come out with IDs.
   * If you want to see a list of users, use the User Inquiry connector together.
   * If you want to see the user's nickname or name that corresponds to the user's ID, refer to the User Inquiry connector.
   *
   * @summary Get usergroups in workspace
   */
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/slack.svg",
  )
  @ApiTags("Slack")
  @TypedRoute.Patch("get-user-groups")
  async getUserGroups(
    @TypedBody() input: ISlack.IGetUserGroupInput,
  ): Promise<ISlack.IGetUserGroupOutput> {
    return retry(() => this.slackProvider.getUserGroups(input))();
  }

  /**
   * Get Requester's Information
   *
   * You can use that function to get requester's information.
   * If you want to get information about requester, call this function.
   * Then you can use that information wherever you need requester's information.
   *
   * @summary Get Requester's Information
   */
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/slack.svg",
  )
  @ApiTags("Slack")
  @TypedRoute.Patch("me")
  async getMyInfo(
    @TypedBody() input: ISlack.ISecret,
  ): Promise<ISlack.IGetMyInfoOutput> {
    return retry(() => this.slackProvider.getMyInfo(input))();
  }

  /**
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
   *
   * @summary Delete Messages
   */
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/slack.svg",
  )
  @ApiTags("Slack")
  @TypedRoute.Delete("messages")
  async deleteMessage(
    @TypedBody() input: ISlack.IDeleteMessageInput,
  ): Promise<void> {
    return retry(() => this.slackProvider.deleteMessage(input))();
  }
}
