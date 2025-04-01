import { promises as fs } from "fs";
import { execSync } from "child_process";
import { randomUUID } from "crypto";
import path from "path";
import { IMarpService } from "../structures/IMarpService";
import { AwsS3Service } from "@wrtnlabs/connector-aws-s3";

export class MarpService {
  constructor(private readonly props: IMarpService.IProps) {}
  /**
   * Marp Service.
   *
   * Converts Marp markdown to a PPT and uploads to S3.
   *
   * @param input The Marp markdown input
   * @returns Promise resolving to the S3 link of the converted PPT
   */
  async convertToPpt(
    input: IMarpService.IConvertInput,
  ): Promise<IMarpService.IConvertOutput> {
    const uuid = randomUUID();
    const markdownFilePath = path.join(__dirname, `${uuid}.md`);
    const pptFilePath = path.join(__dirname, `${uuid}.html`);

    const s3 = new AwsS3Service({
      ...this.props.aws.s3,
    });

    try {
      await fs.writeFile(markdownFilePath, input.markdown);

      // Marp CLI를 사용하여 마크다운 파일을 PPT로 변환
      const command = `npx @marp-team/marp-cli ${markdownFilePath} -o ${pptFilePath}`;
      execSync(command, { stdio: "ignore" });

      const data = await fs.readFile(pptFilePath);
      const uploaded = await s3.uploadObject({
        contentType: "text/html; charset=UTF-8",
        data: data,
        key: input.s3.key,
      });

      return { s3Link: uploaded };
    } catch (error) {
      throw new Error(
        `Failed to convert Marp markdown to PPT: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
