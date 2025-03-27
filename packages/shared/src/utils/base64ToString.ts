import typia from "typia";

export const base64ToString = (base64: string): string => {
  try {
    typia.assert<string & typia.tags.Format<"byte">>(base64);
  } catch (err) {
    throw new Error("Invalid base64 string");
  }

  return Buffer.from(base64, "base64").toString("utf-8");
};
