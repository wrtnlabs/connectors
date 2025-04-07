import { Block, KnownBlock } from "@slack/web-api";
import { StrictOmit } from "@wrtnlabs/connector-shared";
import { ISlackService } from "../structures/ISlackService";

export class SlackTemplateService {
  private readonly props_: ISlackService.IProps;

  constructor(props: ISlackService.IProps) {
    this.props_ = props;
  }
  voteTemplate(
    input: StrictOmit<ISlackService.IHoldVoteInput, "channel"> & {
      /**
       * @title requester's name
       */
      requester: string;
    },
  ): (Block | KnownBlock)[] {
    const NoVoted: ISlackService.NoVoted = {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: "No votes",
        },
      ],
    };

    const options = input.items.flatMap((item, i): (Block | KnownBlock)[] => {
      return [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: item.link ? `<${item.link}|${item.text}>` : item.text,
          },
          accessory: {
            type: "button",
            text: { type: "plain_text", emoji: true, text: "Vote" },
            value: `pick_${i}/${this.props_.slackToken}`,
          },
        },
        NoVoted,
      ];
    });

    return [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${input.title}* Poll by ${input.requester}`,
        },
      },
      {
        type: "divider",
      },
      ...options,
      {
        type: "divider",
      },
      // {
      //   type: "actions",
      //   elements: [
      //     {
      //       type: "button",
      //       text: { type: "plain_text", emoji: true, text: "Add a suggestion" },
      //       value: "suggestion",
      //     },
      //   ],
      // },
    ];
  }
}
