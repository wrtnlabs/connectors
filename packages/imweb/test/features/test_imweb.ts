import { ImwebService } from "@wrtnlabs/connector-imweb";
import typia from "typia";
import { TestGlobal } from "../TestGlobal";

export const test_imweb_get_access_token = async () => {
  const imwebService = new ImwebService({
    imwebApiKey: TestGlobal.env.IMWEB_TEST_API_KEY,
    imwebSecretKey: TestGlobal.env.IMWEB_TEST_API_SECRET,
  });

  const auth = await imwebService.getAccessToken();

  typia.assert(auth);

  return auth.access_token;
};

export const test_api_connector_imweb_get_products = async () => {
  const imwebService = new ImwebService({
    imwebApiKey: TestGlobal.env.IMWEB_TEST_API_KEY,
    imwebSecretKey: TestGlobal.env.IMWEB_TEST_API_SECRET,
  });

  const res = await imwebService.getProducts({});

  typia.assert(res);
};
