import { GmailService } from "@wrtnlabs/connector-gmail";
import { TestGlobal } from "../TestGlobal";

export const test_gmail_create_draft_without_files = async () => {
  const gmailService = new GmailService({
    clientId: TestGlobal.env.GOOGLE_CLIENT_ID,
    clientSecret: TestGlobal.env.GOOGLE_CLIENT_SECRET,
    secret: TestGlobal.env.GOOGLE_TEST_SECRET,
  });

  await gmailService.createDraft({
    to: ["store@wrtn.io"],
    subject: "안녕하세요",
    body: "Gmail Connector 테스트 입니다.",
    cc: ["store@wrtn.io"],
  });
};
