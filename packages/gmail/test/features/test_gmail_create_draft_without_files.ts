import { GmailService } from "@wrtnlabs/connector-gmail";
import { TestGlobal } from "../TestGlobal";

export const test_gmail_create_draft_without_files = async () => {
  const gmailService = new GmailService({
    googleClientId: TestGlobal.env.GOOGLE_CLIENT_ID,
    googleClientSecret: TestGlobal.env.GOOGLE_CLIENT_SECRET,
    googleRefreshToken: TestGlobal.env.GOOGLE_TEST_SECRET,
  });

  await gmailService.createDraft({
    to: ["store@wrtn.io"],
    subject: "안녕하세요",
    body: "Gmail Connector 테스트 입니다.",
    cc: ["store@wrtn.io"],
  });
};
