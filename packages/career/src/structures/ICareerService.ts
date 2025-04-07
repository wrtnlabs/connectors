import { SnakeToCamel } from "@wrtnlabs/connector-shared";

export namespace ICareerService {
  export const ENV_LIST = ["SERP_API_KEY"] as const;

  export type IProps = {
    [key in SnakeToCamel<(typeof ENV_LIST)[number]>]: string;
  };
}
