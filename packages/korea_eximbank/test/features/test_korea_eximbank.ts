import typia from "typia";
import { KoreaEximbankService } from "@wrtnlabs/connector-korea-eximbank";
import { TestGlobal } from "../TestGlobal";

export const test_korea_eximbank_get_exchanage = async () => {
  const koreaEximbankService = new KoreaEximbankService({
    apiKey: TestGlobal.env.KOREA_EXIM_BANK_API_KEY,
  });

  const res = await koreaEximbankService.getExchange();

  typia.assert(res);
};
