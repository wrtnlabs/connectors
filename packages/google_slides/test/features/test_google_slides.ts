import typia from "typia";
import { TestGlobal } from "../TestGlobal";
import {
  GoogleSlidesService,
  IGoogleSlidesService,
} from "@wrtnlabs/connector-google-slides";

// const createPresentationName = () => {
//   // 현재 시간을 나타내는 Date 객체 생성
//   const currentDate = new Date();

//   // 한국 표준시(UTC+9)와 로컬 시간과의 차이(분) 계산
//   const offset = 9 * 60; // 한국 표준시는 UTC+9
//   const localOffset = currentDate.getTimezoneOffset(); // 로컬 시간과 UTC와의 차이(분)
//   const koreanOffset = offset + localOffset; // 한국 표준시와 로컬 시간과의 차이(분)

//   // 한국 표준시(UTC+9)로 현재 시간 설정
//   const koreanTime = new Date(currentDate.getTime() + koreanOffset * 60 * 1000);

//   // 한국 표준시를 출력하기 위해 각 부분 추출
//   const year = koreanTime.getFullYear();
//   const month = koreanTime.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더함
//   const day = koreanTime.getDate();
//   const hours = koreanTime.getHours();
//   const minutes = koreanTime.getMinutes();
//   const seconds = koreanTime.getSeconds();

//   return (
//     year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds
//   );
// };

/**
 * 어떤 파라미터를 넣든 간에 presentationId를 제외한 다른 body 데이터는 무시되고 빈 프레젠테이션이 생성된다.
 * @param connection
 */
export const test_api_connector_google_slides_create_presentation =
  async () => {
    const googleSlideService = new GoogleSlidesService({
      clientId: TestGlobal.env.GOOGLE_CLIENT_ID,
      clientSecret: TestGlobal.env.GOOGLE_CLIENT_SECRET,
      secret: TestGlobal.env.GOOGLE_TEST_SECRET,
      aws: {
        s3: {
          accessKeyId: TestGlobal.env.AWS_ACCESS_KEY_ID,
          bucket: TestGlobal.env.AWS_S3_BUCKET,
          region: "ap-northeast-2",
          secretAccessKey: TestGlobal.env.AWS_SECRET_ACCESS_KEY,
        },
      },
    });

    /**
     * create a new Google Slides Presentation.
     */
    const res = await googleSlideService.createPresentation();

    typia.assert(res);
    return res;
  };

/**
 * 어떤 파라미터를 넣든 간에 presentationId를 제외한 다른 body 데이터는 무시되고 빈 프레젠테이션이 생성된다.
 * @param connection
 */
export const test_api_connector_google_slides_create_presentation_with_one_slide =
  async () => {
    // const PresentationName = `${createPresentationName()} - with one slide`;

    const googleSlideService = new GoogleSlidesService({
      clientId: TestGlobal.env.GOOGLE_CLIENT_ID,
      clientSecret: TestGlobal.env.GOOGLE_CLIENT_SECRET,
      secret: TestGlobal.env.GOOGLE_TEST_SECRET,
      aws: {
        s3: {
          accessKeyId: TestGlobal.env.AWS_ACCESS_KEY_ID,
          bucket: TestGlobal.env.AWS_S3_BUCKET,
          region: "ap-northeast-2",
          secretAccessKey: TestGlobal.env.AWS_SECRET_ACCESS_KEY,
        },
      },
    });

    /**
     * create a new Google Slides Presentation.
     */
    const res = await googleSlideService.createPresentation();

    typia.assert(res);
  };

/**
 * 어떤 파라미터를 넣든 간에 presentationId를 제외한 다른 body 데이터는 무시되고 빈 프레젠테이션이 생성된다.
 * @param connection
 */
export const test_api_connector_google_slides_create_random_presentation =
  async () => {
    const googleSlideService = new GoogleSlidesService({
      clientId: TestGlobal.env.GOOGLE_CLIENT_ID,
      clientSecret: TestGlobal.env.GOOGLE_CLIENT_SECRET,
      secret: TestGlobal.env.GOOGLE_TEST_SECRET,
      aws: {
        s3: {
          accessKeyId: TestGlobal.env.AWS_ACCESS_KEY_ID,
          bucket: TestGlobal.env.AWS_S3_BUCKET,
          region: "ap-northeast-2",
          secretAccessKey: TestGlobal.env.AWS_SECRET_ACCESS_KEY,
        },
      },
    });

    /**
     * create a new Google Slides Presentation.
     */
    const res = await googleSlideService.createPresentation();

    typia.assert(res);

    return res;
  };

export const test_api_connector_google_slides_get_one_presentation =
  async () => {
    const createdPresentation =
      await test_api_connector_google_slides_create_random_presentation();

    if (!createdPresentation.presentationId) {
      throw new Error("생성 단계에서 실패하여 조회 로직 실패");
    }

    const googleSlideService = new GoogleSlidesService({
      clientId: TestGlobal.env.GOOGLE_CLIENT_ID,
      clientSecret: TestGlobal.env.GOOGLE_CLIENT_SECRET,
      secret: TestGlobal.env.GOOGLE_TEST_SECRET,
      aws: {
        s3: {
          accessKeyId: TestGlobal.env.AWS_ACCESS_KEY_ID,
          bucket: TestGlobal.env.AWS_S3_BUCKET,
          region: "ap-northeast-2",
          secretAccessKey: TestGlobal.env.AWS_SECRET_ACCESS_KEY,
        },
      },
    });

    const presentation = await googleSlideService.getPresentation({
      presentationId: createdPresentation.presentationId,
    });

    typia.assert(presentation);
  };

export const test_api_connector_google_slides_append_image_slide = async () => {
  const presentation =
    await test_api_connector_google_slides_create_random_presentation();

  const googleSlideService = new GoogleSlidesService({
    clientId: TestGlobal.env.GOOGLE_CLIENT_ID,
    clientSecret: TestGlobal.env.GOOGLE_CLIENT_SECRET,
    secret: TestGlobal.env.GOOGLE_TEST_SECRET,
    aws: {
      s3: {
        accessKeyId: TestGlobal.env.AWS_ACCESS_KEY_ID,
        bucket: TestGlobal.env.AWS_S3_BUCKET,
        region: "ap-northeast-2",
        secretAccessKey: TestGlobal.env.AWS_SECRET_ACCESS_KEY,
      },
    },
  });

  const testImage = `https://dev-studio-pro.s3.amazonaws.com/connector/generate-story-copy/f42e4450-3064-43d1-b973-2c913f08581a`;
  await googleSlideService.appendImageSlide({
    id: presentation.presentationId as string,
    templates: [
      {
        type: "Vertical",
        contents: {
          text: {
            text: "Vertical",
          },
          url: testImage,
        },
      } as IGoogleSlidesService.Template.Vertical,
      {
        type: "Square",
        contents: {
          text: {
            text: "Square",
          },
          url: testImage,
        },
      } as IGoogleSlidesService.Template.Square,
      {
        type: "Landscape",
        contents: {
          text: {
            text: "Landscape",
          },
          url: testImage,
        },
      } as IGoogleSlidesService.Template.Landscape,
      {
        type: "Entire",
        contents: {
          text: {
            text: "Entire",
          },
          url: testImage,
        },
      } as IGoogleSlidesService.Template.Entire,
      {
        type: "QuarterDivision",
        contents: [
          {
            text: {
              text: "QuarterDivision1",
            },
            url: testImage,
          },
          {
            text: {
              text: "QuarterDivision2",
            },
            url: testImage,
          },
          {
            text: {
              text: "QuarterDivision3",
            },
            url: testImage,
          },
          {
            text: {
              text: "QuarterDivision4",
            },
            url: testImage,
          },
        ],
      } as IGoogleSlidesService.Template.QuarterDivision,
    ],
  });
};
