import { CareerService } from "@wrtnlabs/connector-career";
import typia from "typia";
import { TestGlobal } from "../TestGlobal";

export const test_career = async (): Promise<void> => {
  const careerService = new CareerService({
    serpApiKey: TestGlobal.env.SERP_API_KEY,
  });

  const jumpit_result = await careerService.searchJobByJumpit({
    andKeywords: ["파이썬"],
    orKeywords: [],
    notKeywords: [],
    max_results: 10,
  });

  typia.assert(jumpit_result);

  const wanted_result = await careerService.searchJobByWanted({
    andKeywords: ["NestJS"],
    orKeywords: [],
    notKeywords: [],
    max_results: 20,
  });

  typia.assert(wanted_result);

  const incruit_result = await careerService.searchJobByIncruit({
    andKeywords: ["React"],
    orKeywords: [],
    notKeywords: [],
    max_results: 10,
  });

  typia.assert(incruit_result);

  const saramin_result = await careerService.searchJobBySaramin({
    andKeywords: ["JAVA"],
    orKeywords: [],
    notKeywords: [],
    max_results: 10,
  });

  typia.assert(saramin_result);
};
