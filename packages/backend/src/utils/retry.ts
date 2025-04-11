import { AxiosError } from "axios";
import typia from "typia";
import { TypedSplit } from "./TypedSplit";
import { IGoogleAdsService } from "@wrtnlabs/connector-google-ads/lib";

const TIMEOUT = "TIMEOUT" as const;

function backoff(attempt: number, delayMs = 1000): Promise<void> {
  const baseDelay = 2 * attempt * delayMs; // 지수적으로 증가하는 대기 시간 (밀리초)
  const jitter = Math.random() * baseDelay;
  const delay = baseDelay + jitter;
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export function retry<T extends any[], ReturnType>(
  fn: (...args: T) => ReturnType,
  count: number = 5, // default로 5번까지는 재실행되게 한다.
  options?: {
    timeLimit?: number; // 이 시간이 지날 경우 실패한 것으로 간주함
    delayMs?: number; // 이 시간 값은 backoff에 영향을 주는 값
  },
) {
  return async function retryImplements(
    ...args: T
  ): Promise<Awaited<ReturnType>> {
    let attempts = 0;
    while (attempts < count) {
      let timeoutId: NodeJS.Timeout | null = null;
      try {
        const response = await Promise.race([
          fn(...args),
          ...(options?.timeLimit
            ? [
                new Promise<typeof TIMEOUT>((resolve) => {
                  timeoutId = setTimeout(
                    () => resolve(TIMEOUT),
                    options.timeLimit,
                  );
                }),
              ]
            : []),
        ]);

        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        if (response === TIMEOUT) {
          throw new Error("retry error : timeout");
        }

        return response;
      } catch (error) {
        attempts++;
        if (attempts >= count) {
          throw error;
        }

        if (error instanceof AxiosError) {
          if (
            typia.is<IGoogleAdsService.IGoogleAdsError>(error.response?.data)
          ) {
            const maxDelay = Math.max(
              ...error.response.data.error.details
                .flatMap((detail) => detail.errors)
                .map((googleError) => {
                  if ("quotaError" in googleError.errorCode) {
                    const errorType = googleError.errorCode.quotaError;
                    if (errorType === "RESOURCE_EXHAUSTED") {
                      if (
                        typia.is<IGoogleAdsService.RESOURCE_EXHAUSTED_ERROR>(
                          googleError,
                        )
                      ) {
                        const delay =
                          googleError.details.quotaErrorDetails.retryDelay;
                        const [seconds] = TypedSplit(delay, "s");

                        console.log(`delay ${seconds}s...`);
                        return seconds === "0" ? 1 : Number(seconds);
                      }
                    }
                  }
                  return 0;
                }),
            );

            console.log(`retry delay: ${maxDelay} seconds...`);
            await new Promise<void>((res) => setTimeout(res, maxDelay * 1000));
          }
        }

        await backoff(attempts, options?.delayMs);
        console.log(`retry attempts: ${attempts}`, JSON.stringify(error));
      }
    }
    throw new Error(`${fn.name} failed count: ${count}`);
  };
}
