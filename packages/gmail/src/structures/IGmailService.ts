import { tags } from "typia";
import { SnakeToCamel } from "@wrtnlabs/connector-shared";

export const ENV_LIST = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_REFRESH_TOKEN",
] as const;

export namespace IGmailService {
  export type IProps = {
    [key in SnakeToCamel<(typeof ENV_LIST)[number]>]: string;
  };

  export interface IDeleteMailListInput {
    /**
     * @title Email IDs to delete
     * @description Please select the emails to delete.
     */
    ids: string[];
  }

  /**
   * @title Information required to send email
   */
  export interface ICreateMailInput {
    /**
     * The email address of the recipient.
     *
     * @title Recipient's email address
     */
    to: string[];

    /**
     * Subject of the email to be sent.
     *
     * @title Email subject
     */
    subject: string;

    /**
     * The body of the email to be sent. It must be written in html. Otherwise, the body may not be displayed properly. Please apply the CSS format applicable to gmail. Please write the html length so that it is not too long. If it is too long, it may not be sent. If there is a link or url <a>, be sure to use the title attribute of the html tag to provide a link. @title Email body.</a>
     */
    body: string;

    /**
     * Email address of the person to be referenced.
     *
     * @title Email address of the person to be referenced
     */
    cc?: string[];

    /**
     * Bcc email address.
     *
     * @title Bcc email address
     */
    Bcc?: string[];

    /**
     * @title files
     */
    files?: {
      /**
       * @title filename
       */
      filename: string;

      /**
       * @title file uri
       */
      fileUrl: string & tags.Format<"iri">;
    }[];
  }

  /**
   * @title Mail transmission result
   */
  export interface ISendMailOutput {
    /**
     * The ID of the sent email.
     *
     * @title The ID of the sent email
     */
    id: string;
  }

  /**
   * @title Information required to reply to email
   */
  export interface IReplyInput {
    /**
     * The id of the email to reply to.
     */
    id: string;

    /**
     * Phrase to reply.
     *
     * @title Phrase to reply
     */
    replyText: string;
  }

  /**
   * @title label color
   */
  export interface ILabelColor {
    /**
     * Label text color.
     *
     * @title Label text color
     */
    textColor: string;

    /**
     * Label background color.
     *
     * @title Label background color
     */
    backgroundColor: string;
  }

  /**
   * @title Information required to create a label
   */
  export interface ILabelInput {
    /**
     * The name of the label to create.
     *
     * @title Label name
     */
    labelName: string;

    /**
     * Visibility status of the label to be created.
     *
     * Hidden / Visible / Visible when unread
     *
     * - labelHide: Hidden
     * - labelShow: Visible
     * - labelShowIfUnread: Visible when unread
     *
     * Only three possible values are available: labelHide, labelShow, and labelShowIfUnread.
     *
     * @title Visibility status of the label
     */
    labelListVisibility?: labelListVisibility;

    /**
     * The visibility status of the generated labeled mail.
     *
     * Hidden / Visible
     *
     * - hide: hidden
     * - show: visible
     *
     * There are only two possible values: hide and show.
     *
     * @title The visibility status of the labeled mail
     */
    messageListVisibility?: messageListVisibility;

    /**
     * Color of the mail label to be generated
     *
     * @title Label Color
     */
    color?: ILabelColor;
  }

  /**
   * - labelHide: hidden
   * - labelShow: visible
   * - labelShowIfUnread: visible when unread
   *
   * @title Label visibility status
   */
  type labelListVisibility = "labelHide" | "labelShow" | "labelShowIfUnread";

  /**
   * - hide: hidden
   * - show: visible
   *
   * Public status of emails labeled with @title.
   */
  type messageListVisibility = "hide" | "show";

  /**
   * @title Label Creation Result
   */
  export interface ILabelOutput {
    /**
     * The id of the generated label.
     *
     * @title Generated label id
     */
    id: string;
  }

  /**
   * @title Information required to assign a label
   */
  export interface IMailLabelOperationInput {
    /**
     * The id of the email to assign or remove a label.
     *
     * @title The id of the email
     */
    id: string;

    /**
     * A list of labels to assign or remove.
     *
     * @title A list of labels
     */
    labelIds: string[];
  }

  /**
   * @title Information needed to search email lists
   */
  export interface IFindEmailListInput {
    /**
     * The email address of the sender of the email.
     *
     * @title The email of the sender
     */
    from?: string;

    /**
     * The email address of the recipient.
     *
     * @title The email address of the recipient
     */
    to?: string;

    /**
     * Email Subject.
     *
     * @title Email Subject
     */
    subject?: string;

    /**
     * Returns only emails after a given date.
     *
     * @title After a specific date
     */
    after?: string;

    /**
     * Returns only emails before a given date.
     *
     * @title Before a specific date
     */
    before?: string; // 특정 날짜 이전

    /**
     * Label assigned to the email.
     *
     * @title Label assigned to the email
     */
    label?: string;

    /**
     * Number of returned mails.
     *
     * @title Maximum number of returned mails
     */
    maxResults?: number & tags.Maximum<500> & tags.Minimum<1>;

    /**
     * A list of labels to return only emails with labels that all match the specified label ID.
     *
     * @title A list of labels to filter by
     */
    labelIds?: string[];
  }

  /**
   * @title Email list search results
   */
  export interface IFindGmailListOutput {
    /**
     * Searched gmail data information.
     *
     * @title gmail search data information
     */
    data: IFindGmailOutput[];
  }

  /**
   * @title Email search results
   */
  export interface IFindGmailOutput {
    /**
     * Unique id of the email.
     *
     * @title Email id
     */
    id?: string | null;

    /**
     * Label id assigned to the email.
     *
     * @title Email Label id
     */
    labelIds?: string[] | null;

    /**
     * The email address of the person who sent the email.
     *
     * @title Sender Email
     */
    from?: string | null;

    /**
     * The subject of the email.
     *
     * @title Subject
     */
    subject?: string | null;

    /**
     * Summary of the body of the email.
     *
     * @title Summary of the body
     */
    body?: string | null;

    /**
     * List of files attached to the email.
     *
     * @title Attachments
     */
    attachments?: IAttachmentOutput[] | null;
  }

  /**
   * @title Attachment file information
   */

  export interface IAttachmentOutput {
    /**
     * The immutable ID of the message part.
     *
     * @title The immutable ID of the message part
     */
    partId?: string | null;

    /**
     * The MIME type of the message.
     *
     * @title The MIME type of the message part
     */
    mimeType?: string | null;

    /**
     * This message part will only be displayed if it indicates an attachment.
     *
     * @title Attachment name
     */
    filename?: string | null;

    /**
     * The top-level message portion, which represents the entire message payload, contains standard RFC 2822 email headers such as To, From, and Subject.
     *
     * @title Attachment header information
     */
    headers?: IAttachmentHeader[] | null;

    /**
     * The body of the message part of this section, which may be empty for container MIME message parts.
     *
     * @title Attachment header body information
     */
    body?: IAttachmentBody | null;
  }

  /**
   * @title Attachment file header information
   */
  export interface IAttachmentHeader {
    /**
     * Attachment header type.
     *
     * @title Attachment header type
     */
    name?: string | null;

    /**
     * Attachment header value.
     *
     * @title Attachment header value
     */
    value?: string | null;
  }

  /**
   * @title Attached file body information
   */
  export interface IAttachmentBody {
    /**
     * The unique ID of the attached file.
     *
     * @title Attachment file id
     */
    attachmentId?: string | null;

    /**
     * The number of bytes in the attachment data.
     *
     * @title The number of bytes in the attachment data
     */
    size?: (number & tags.Type<"int32">) | null;
  }
}
