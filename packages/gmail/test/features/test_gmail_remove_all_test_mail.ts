import { GmailService } from "@wrtnlabs/connector-gmail";
import { TestGlobal } from "../TestGlobal";

export const test_gmail_remove_all_test_mail = async () => {
  const gmailService = new GmailService({
    clientId: TestGlobal.env.GOOGLE_CLIENT_ID,
    clientSecret: TestGlobal.env.GOOGLE_CLIENT_SECRET,
    secret: TestGlobal.env.GOOGLE_TEST_SECRET,
  });

  /**
   * Find Email
   */
  const emails = await gmailService.findEmails({
    from: "studio@wrtn.io", // 자기 자신으로부터
    subject: "안녕하세요", // "안녕하세요" 라고만 적힌 메일이 온 경우를 삭제한다.
    maxResults: 500,
  });

  const mailIds = emails.data
    .filter((email) => email.subject === "안녕하세요") // 혹시나 커넥터가 업데이트되며 하위호환성이 깨지고 '안녕하세요'가 제목이 아니라 '포함된' 메일들이 될 경우를 대비
    .map((el) => el.id)
    .filter((id) => id !== null && id !== undefined);

  if (emails.data.length) {
    await gmailService.deleteMailList({
      ids: mailIds,
    });
  }
};
