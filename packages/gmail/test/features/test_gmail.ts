import typia from "typia";
import { GmailService } from "../../src/gmail/GmailService";
import { TestGlobal } from "../TestGlobal";
import { IGmailService } from "@wrtnlabs/connector-gmail";
import { RandomGenerator } from "@nestia/e2e";

export const test_gmail = async () => {
  const gmailService = new GmailService({
    googleClientId: TestGlobal.env.GOOGLE_CLIENT_ID,
    googleClientSecret: TestGlobal.env.GOOGLE_CLIENT_SECRET,
    googleRefreshToken: TestGlobal.env.GOOGLE_TEST_SECRET,
  });

  /**
   * Send Email.
   */
  const sendEmailOutput = await gmailService.sendEmail({
    to: ["store@wrtn.io"],
    subject: "안녕하세요",
    body: "Gmail Connector 테스트 입니다.",
    cc: ["store@wrtn.io"],
  });

  const emailId = sendEmailOutput.id;

  /**
   * Find Email.
   */
  const email = await gmailService.findEmail({ id: emailId });
  typia.assert<IGmailService.IFindGmailOutput>(email);

  /**
   * Find Emails.
   */
  const emailList = await gmailService.findEmails({
    from: "store@wrtn.io",
  });
  typia.assert<IGmailService.IFindGmailListOutput>(emailList);

  /**
   * Remove Email. (move mail to trash)
   */
  await gmailService.removeEmail({ id: emailId });

  /**
   * Create Label.
   */
  const label = await gmailService.createLabel({
    labelName: RandomGenerator.name(),
  });
  typia.assert<IGmailService.ILabelOutput>(label);

  /**
   * Add Label To Email.
   */
  await gmailService.addLabelToMail({
    id: emailId,
    labelIds: [label.id],
  });

  /**
   * Remove Label From Email.
   */
  await gmailService.removeLabelFromMail({
    id: emailId,
    labelIds: [label.id],
  });

  /**
   * Reply To Email.
   */
  const reply = await gmailService.reply({
    id: emailId,
    replyText: "답장입니다.",
  });

  /**
   * remove Email. (hard delete)
   */
  await gmailService.hardDelete({ id: emailId });

  /**
   * remove Reply Email. (hard delete)
   */
  await gmailService.hardDelete({ id: reply.id });
};
