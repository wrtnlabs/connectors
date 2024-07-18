import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import axios, { AxiosError } from "axios";
import { Response } from "express";

import { IRag } from "@wrtn/connector-api/lib/structures/connector/rag/IRag";

import { ConnectorGlobal } from "../../../ConnectorGlobal";
import { AwsProvider } from "../aws/AwsProvider";
import { v4 } from "uuid";
import { tags } from "typia";

@Injectable()
export class RagProvider {
  private readonly ragServer = ConnectorGlobal.env.RAG_SERVER_URL;
  private readonly logger = new Logger("RagProvider");
  constructor(private readonly awsProvider: AwsProvider) {}

  async transformInput(
    fileUrl: string & tags.Format<"uri">,
  ): Promise<string & tags.Format<"uri">> {
    const matches = fileUrl.match(
      /https?:\/\/([^.]+)\.s3(?:\.([^.]+))?\.amazonaws\.com\/([\p{L}\p{N}\/.-]+)/gu,
    );

    if (!matches) {
      return fileUrl;
    }
    const transFormedUrl = await this.awsProvider.getGetObjectUrl(matches[0]);
    return transFormedUrl;
  }

  async analyze(input: IRag.IAnalyzeInput): Promise<IRag.IAnalysisOutput> {
    const requestUrl = `${this.ragServer}/file-chat/v1/file`;
    const fileId = v4();
    const chatId = v4();
    // TODO: 타입이 html 일 때 로직 분기 해야함
    const url = await this.transformInput(input.fileUrl);

    /**
     * 파일 크기 5MB 이하로 제한
     */
    const fileSize = await this.awsProvider.getFileSize(url);
    if (fileSize > 5 * 1024 * 1024) {
      throw new BadRequestException("파일 크기가 5MB 보다 큽니다.");
    }

    const requestBody = {
      url: url,
      file_type: input.fileType,
      file_id: fileId,
      chat_id: chatId,
    };
    const res = await axios.post(requestUrl, requestBody, {
      headers: {
        "x-service-id": "echo_file_chat",
      },
    });
    const jobId = res.data.job_id;
    return new Promise((resolve, reject) => {
      const intervalId = setInterval(async () => {
        try {
          const status = (await this.getStatus(jobId)).status;
          if (status === "RUNNING") {
            this.logger.log(`Document analysis in progress - jobId: ${jobId}`);
          } else if (status === "COMPLETED") {
            this.logger.log(`Document analysis completed jobId: ${jobId}`);
            clearInterval(intervalId);
            resolve({ jobId, chatId });
          } else if (status === "FAILED") {
            this.logger.error(`Document analysis failed - docId: ${jobId}`);
            clearInterval(intervalId);
            reject(
              new InternalServerErrorException(`Document analysis failed`),
            );
          }
        } catch (err) {
          clearInterval(intervalId);
          if (
            err instanceof AxiosError &&
            err.response &&
            err.response.status === 404 &&
            err.response.statusText.includes("Not Found")
          ) {
            this.logger.error(`Status not found for jobId: ${jobId}`);
            reject(new NotFoundException(`Document analysis failed`));
          } else {
            reject(err);
          }
        }
      }, 2000);
    });
  }

  async getStatus(jobId: string): Promise<IRag.IStatusOutput> {
    const requestUrl = `${this.ragServer}/file-chat/v1/status`;
    const res = await axios.get(requestUrl, {
      params: {
        job_id: jobId,
      },
      headers: {
        "x-service-id": "echo_file_chat",
      },
    });
    return res.data;
  }

  async generate(
    input: IRag.IGenerateInput,
    res: Response,
    chatId: string,
  ): Promise<IRag.IGenerateOutput> {
    const requestUrl = `${this.ragServer}/file-chat/v1/chat/stream`;
    const requestBody = {
      text: input.query,
      chat_history: input.histories,
    };
    const response = await axios.post(requestUrl, requestBody, {
      responseType: "stream",
      params: {
        chat_id: chatId,
      },
      timeout: 30000,
      headers: {
        "x-service-id": "echo_file_chat",
      },
    });
    const stream = response.data;
    let dataBuffer = "";

    return new Promise<IRag.IGenerateOutput>((resolve, reject) => {
      // 스트림 데이터 저장
      stream.on("data", (chunk: Buffer) => {
        const chunkStr = chunk.toString();
        // 'data: ' 접두사 제거
        const lines = chunkStr.split("\n");
        for (let line of lines) {
          if (line.startsWith("data: ")) {
            line = line.slice(6); // 'data: ' 제거
            try {
              const data = JSON.parse(line);
              if (
                data.choices &&
                data.choices[0] &&
                data.choices[0].delta &&
                data.choices[0].delta.content
              ) {
                dataBuffer += data.choices[0].delta.content;
              }
            } catch (error) {
              // JSON 파싱 에러 발생 시 무시
            }
          }
        }
      });

      // 스트림 끝난 뒤 문자열 반환
      stream.on("end", () => {
        try {
          const result = dataBuffer.trim();
          res.write(JSON.stringify({ answer: result }));
          resolve({ answer: result });
        } catch (err) {
          this.logger.error("Error creating result:", err);
          reject(err);
        } finally {
          res.end();
        }
      });

      stream.on("error", (err: any) => {
        this.logger.error(`Stream error: ${err}`);
        reject(err);
        res.end();
      });
    });
  }
}
