import { GmailService } from "@wrtnlabs/connector-gmail";
import { TestGlobal } from "../TestGlobal";

export const test_gmail_create_draft_with_files = async () => {
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
    files: [
      {
        filename: "file1.xlsx",
        fileUrl: `https://studio-api-bucket.s3.ap-northeast-2.amazonaws.com/a.xlsx`,
      },
      {
        filename: "file2.csv",
        fileUrl: `https://studio-api-bucket.s3.ap-northeast-2.amazonaws.com/a.csv`,
      },
    ],
  });
};
