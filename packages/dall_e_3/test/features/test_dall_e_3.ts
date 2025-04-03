import { DallE3Service, IDallE3Service } from "@wrtnlabs/connector-dall-e-3";
import { AwsS3Service } from "@wrtnlabs/connector-aws-s3";
import OpenAI from "openai";
import typia from "typia";
import { TestGlobal } from "../TestGlobal";

export const test_dall_e_3 = async () => {
  const openai = new OpenAI({
    apiKey: TestGlobal.env.OPENAI_API_KEY,
  });

  const awsS3Service = new AwsS3Service({
    awsAccessKeyId: TestGlobal.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: TestGlobal.env.AWS_SECRET_ACCESS_KEY,
    awsS3Bucket: TestGlobal.env.AWS_S3_BUCKET,
    awsS3Region: "ap-northeast-2",
  });

  const dalleService = new DallE3Service(
    {
      openai,
    },
    awsS3Service,
  );

  const requestBody: IDallE3Service.IRequest = {
    path: "dall_e_3/test.png",
    prompt: `You are a marketing copywriter, given the task of writing a marketing copy.
You are given the marketing purpose, the distribution channel and the reference content, from which you should use the keyword to generate the marketing copy.
The marketing purpose is the following: {
  purpose: 'visit',
  product_name: 'Studio Pro',
  unique_selling_point: [ 'auto-generate workflows powered by AI' ],
  user_benefit: [
    'no-code automation',
    'one-click deployment',
    'rich third-party integrations ready to use',
    'store and share your workflows',
    'use pre-built workflows',
    'use other workflows as building blocks from the community',
    'workflow marketplace to sell your workflows',
    'automatically generate workflows from your data',
    'run your workflows on a schedule',
    'free to use',
    'no credit card required'
  ]
}
The distribution channel is the following: 'instagram_feed'
The keyword is the following: { keyword: 'Easily Automate Business Tasks – No-Code Automation Course' }
The reference content (content from which the keyword was extracted) is the following: {
  contents: 'Learn how to effectively use automation to streamline your business tasks. From mastering lead management with tools like ...',
  image: 'https://i.ytimg.com/vi/5kJv254sebQ/hq720.jpg?sqp=-oaymwEcCOgCEMoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBz-zX0cI7T_nUdImU7G89wmrAY_w',
  statistics: { view_count: 97656 },
  title: 'Easily Automate Business Tasks – No-Code Automation Course',
  type: 'video',
  source: 'youtube',
  url: 'https://www.youtube.com/watch?v=5kJv254sebQ'
}
Unless specified by the user, always create the marketing copy in Korean.
I REPEAT: unless the user said otherwise, always use Korean.
Generate the marketing copy.`,
    image_ratio: "square",
  };

  const output = await dalleService.generateImage(requestBody);

  typia.assert<IDallE3Service.IResponse>(output);
};
