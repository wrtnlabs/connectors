import { TestGlobal } from "../TestGlobal";
import { GoogleService } from "@wrtnlabs/connector-google";

export const test_refresh_access_token = async () => {
  const googleService = new GoogleService({
    clientId: TestGlobal.env.GOOGLE_CLIENT_ID,
    clientSecret: TestGlobal.env.GOOGLE_CLIENT_SECRET,
    secret: TestGlobal.env.GOOGLE_TEST_SECRET,
  });

  const res = await googleService.refreshAccessToken();

  console.log(res);
};
