import typia from "typia";
import { KakaoTalkService } from "@wrtnlabs/connector-kakao-talk";
import { TestGlobal } from "../TestGlobal";

export const test_kakao_talk_text_memo = async () => {
  const kakaoTalkService = new KakaoTalkService({
    kakaoTalkClientId: TestGlobal.env.KAKAO_TALK_CLIENT_ID,
    kakaoTalkClientSecret: TestGlobal.env.KAKAO_TALK_CLIENT_SECRET,
    kakaoTalkRefreshToken: TestGlobal.env.KAKAO_TALK_TEST_REFRESH_TOKEN,
  });

  /**
   * 텍스트 메시지 발송.
   */
  const sendTextForm = await kakaoTalkService.memo({
    props: {
      template_object: {
        object_type: "text",
        text: "텍스트 영역입니다. 최대 200자 표시 가능합니다.",
        link: {
          web_url: "https://studio-pro.wrtn.ai",
          mobile_web_url: "https://studio-pro.wrtn.ai",
        },
      },
    },
  });

  typia.assert(sendTextForm);
};

export const test_kakao_talk_feed_memo = async () => {
  const kakaoTalkService = new KakaoTalkService({
    kakaoTalkClientId: TestGlobal.env.KAKAO_TALK_CLIENT_ID,
    kakaoTalkClientSecret: TestGlobal.env.KAKAO_TALK_CLIENT_SECRET,
    kakaoTalkRefreshToken: TestGlobal.env.KAKAO_TALK_TEST_REFRESH_TOKEN,
  });

  /**
   * 피드 메시지 발송.
   */
  const sendTextForm = await kakaoTalkService.memo({
    props: {
      template_object: {
        object_type: "feed",
        content: {
          title: "오늘의 디저트",
          description: "아메리카노, 빵, 케익",
          image_url:
            "https://mud-kage.kakao.com/dn/NTmhS/btqfEUdFAUf/FjKzkZsnoeE4o19klTOVI1/openlink_640x640s.jpg",
          image_width: 640,
          image_height: 640,
          link: {
            web_url: "https://studio-pro.wrtn.ai",
            mobile_web_url: "https://studio-pro.wrtn.ai",
            android_execution_params: "contentId=100",
            ios_execution_params: "contentId=100",
          },
        },
        item_content: {
          profile_text: "Kakao",
          profile_image_url:
            "https://mud-kage.kakao.com/dn/Q2iNx/btqgeRgV54P/VLdBs9cvyn8BJXB3o7N8UK/kakaolink40_original.png",
          title_image_url:
            "https://mud-kage.kakao.com/dn/Q2iNx/btqgeRgV54P/VLdBs9cvyn8BJXB3o7N8UK/kakaolink40_original.png",
          title_image_text: "Cheese cake",
          title_image_category: "Cake",
          items: [
            {
              item: "Cake1",
              item_op: "1000원",
            },
            {
              item: "Cake2",
              item_op: "2000원",
            },
            {
              item: "Cake3",
              item_op: "3000원",
            },
            {
              item: "Cake4",
              item_op: "4000원",
            },
            {
              item: "Cake5",
              item_op: "5000원",
            },
          ],
          sum: "Total",
          sum_op: "15000원",
        },
        social: {
          like_count: 100,
          comment_count: 200,
          shared_count: 300,
          view_count: 400,
          subscriber_count: 500,
        },
        buttons: [
          {
            title: "웹으로 이동",
            link: {
              web_url: "https://studio-pro.wrtn.ai",
              mobile_web_url: "https://studio-pro.wrtn.ai",
            },
          },
          {
            title: "앱으로 이동",
            link: {
              android_execution_params: "contentId=100",
              ios_execution_params: "contentId=100",
            },
          },
        ],
      },
    },
  });

  typia.assert(sendTextForm);
};

export const test_kakao_talk_get_calendars = async () => {
  const kakaoTalkService = new KakaoTalkService({
    kakaoTalkClientId: TestGlobal.env.KAKAO_TALK_CLIENT_ID,
    kakaoTalkClientSecret: TestGlobal.env.KAKAO_TALK_CLIENT_SECRET,
    kakaoTalkRefreshToken: TestGlobal.env.KAKAO_TALK_TEST_REFRESH_TOKEN,
  });

  const calendarInfo = await kakaoTalkService.getCalendars();

  typia.assert(calendarInfo);
};

export const test_kakao_talk_get_calendar_events = async () => {
  const kakaoTalkService = new KakaoTalkService({
    kakaoTalkClientId: TestGlobal.env.KAKAO_TALK_CLIENT_ID,
    kakaoTalkClientSecret: TestGlobal.env.KAKAO_TALK_CLIENT_SECRET,
    kakaoTalkRefreshToken: TestGlobal.env.KAKAO_TALK_TEST_REFRESH_TOKEN,
  });

  /**
   * 일정 조회.
   */
  const events = await kakaoTalkService.getEvents({
    props: {
      from: "2024-01-01T12:00:00Z",
      to: "2024-01-31T12:00:00Z",
    },
  });

  typia.assert(events);

  return events;
};

export const test_kakao_talk_create_event = async () => {
  const kakaoTalkService = new KakaoTalkService({
    kakaoTalkClientId: TestGlobal.env.KAKAO_TALK_CLIENT_ID,
    kakaoTalkClientSecret: TestGlobal.env.KAKAO_TALK_CLIENT_SECRET,
    kakaoTalkRefreshToken: TestGlobal.env.KAKAO_TALK_TEST_REFRESH_TOKEN,
  });

  /**
   * 일정 생성.
   */
  const event = await kakaoTalkService.createEvent({
    event: {
      time: {
        start_at: "2023-12-31T15:00:00Z",
        end_at: "2024-01-01T15:00:00Z",
      },
      title: "created_by_wrtn",
    },
  });

  typia.assert(event);
};

/**
 * @todo 캘린더형 메시지는 공개 일정, 즉 카카오톡 채널에 일정을 생성한 후에 사용할 수 있다.
 */
// export const test_kakao_talk_calendar_memo = async (
//
// ) => {
//   /**
//    * 액세스 토큰 갱신.
//    */
//   const res = await kakaoTalkService, {
//     refresh_token: ConnectorGlobal.env.KAKAO_TALK_TEST_REFRESH_TOKEN,
//   });

//   typia.assert(res);

//   const events = await test_kakao_talk_get_calendar_events(connection);
//   const firstEvent = events.events.find((el) => el.id);
//   if (!firstEvent?.id) {
//     throw new Error("생성된 이벤트가 없어 캘린더 타입 메시지 전송 실패.");
//   }

//   /**
//    * 캘린더 메시지 발송.
//    */
//   const sendTextForm = await kakaoTalkService
//
//     {
//       template_object: {
//         object_type: "calendar",
//         content: {
//           title: "일정 제목",
//           description: "일정 설명",
//           image_url:
//             "https://developers.kakao.com/static/images/pc/txt_visual1.png",
//           link: {
//             web_url: "https://studio-pro.wrtn.ai",
//           },
//         },
//         buttons: [
//           {
//             title: "일정 정보 보기",
//             link: {
//               web_url: "https://studio-pro.wrtn.ai",
//               mobile_web_url: "https://studio-pro.wrtn.ai",
//             },
//           },
//         ],
//         id_type: "event",
//         id: firstEvent.id,
//       },
//     },
//   );

//   typia.assert(sendTextForm);
// };

export const test_kakao_talk_list_memo = async () => {
  const kakaoTalkService = new KakaoTalkService({
    kakaoTalkClientId: TestGlobal.env.KAKAO_TALK_CLIENT_ID,
    kakaoTalkClientSecret: TestGlobal.env.KAKAO_TALK_CLIENT_SECRET,
    kakaoTalkRefreshToken: TestGlobal.env.KAKAO_TALK_TEST_REFRESH_TOKEN,
  });

  /**
   * 리스트 메시지 발송.
   */
  const sendTextForm = await kakaoTalkService.memo({
    props: {
      template_object: {
        object_type: "list",
        header_title: "WEEKELY MAGAZINE",
        header_link: {
          web_url: "https://studio-pro.wrtn.ai",
          mobile_web_url: "https://studio-pro.wrtn.ai",
          android_execution_params: "main",
          ios_execution_params: "main",
        },
        contents: [
          {
            title: "자전거 라이더를 위한 공간",
            description: "매거진",
            image_url:
              "https://mud-kage.kakao.com/dn/QNvGY/btqfD0SKT9m/k4KUlb1m0dKPHxGV8WbIK1/openlink_640x640s.jpg",
            image_width: 640,
            image_height: 640,
            link: {
              web_url: "https://studio-pro.wrtn.ai",
              mobile_web_url: "https://studio-pro.wrtn.ai",
              android_execution_params: "/contents/1",
              ios_execution_params: "/contents/1",
            },
          },
          {
            title: "비쥬얼이 끝내주는 오레오 카푸치노",
            description: "매거진",
            image_url:
              "https://mud-kage.kakao.com/dn/boVWEm/btqfFGlOpJB/mKsq9z6U2Xpms3NztZgiD1/openlink_640x640s.jpg",
            image_width: 640,
            image_height: 640,
            link: {
              web_url: "https://studio-pro.wrtn.ai",
              mobile_web_url: "https://studio-pro.wrtn.ai",
              android_execution_params: "/contents/2",
              ios_execution_params: "/contents/2",
            },
          },
          {
            title: "감성이 가득한 분위기",
            description: "매거진",
            image_url:
              "https://mud-kage.kakao.com/dn/NTmhS/btqfEUdFAUf/FjKzkZsnoeE4o19klTOVI1/openlink_640x640s.jpg",
            image_width: 640,
            image_height: 640,
            link: {
              web_url: "https://studio-pro.wrtn.ai",
              mobile_web_url: "https://studio-pro.wrtn.ai",
              android_execution_params: "/contents/3",
              ios_execution_params: "/contents/3",
            },
          },
        ],
        buttons: [
          {
            title: "웹으로 이동",
            link: {
              web_url: "https://studio-pro.wrtn.ai",
              mobile_web_url: "https://studio-pro.wrtn.ai",
            },
          },
          {
            title: "앱으로 이동",
            link: {
              android_execution_params: "main",
              ios_execution_params: "main",
            },
          },
        ],
      },
    },
  });

  typia.assert(sendTextForm);
};

export const test_kakao_talk_location_memo = async () => {
  const kakaoTalkService = new KakaoTalkService({
    kakaoTalkClientId: TestGlobal.env.KAKAO_TALK_CLIENT_ID,
    kakaoTalkClientSecret: TestGlobal.env.KAKAO_TALK_CLIENT_SECRET,
    kakaoTalkRefreshToken: TestGlobal.env.KAKAO_TALK_TEST_REFRESH_TOKEN,
  });

  /**
   * 위치 메시지 발송.
   */
  const sendTextForm = await kakaoTalkService.memo({
    props: {
      template_object: {
        object_type: "location",
        content: {
          title: "카카오 판교오피스",
          description: "카카오 판교오피스 위치입니다.",
          image_url:
            "https://mud-kage.kakao.com/dn/drTdbB/bWYf06POFPf/owUHIt7K7NoGD0hrzFLeW0/kakaolink40_original.png",
          image_width: 800,
          image_height: 800,
          link: {
            web_url: "https://studio-pro.wrtn.ai",
            mobile_web_url: "https://studio-pro.wrtn.ai",
            android_execution_params: "platform=android",
            ios_execution_params: "platform=ios",
          },
        },
        buttons: [
          {
            title: "웹으로 보기",
            link: {
              web_url: "https://studio-pro.wrtn.ai",
              mobile_web_url: "https://studio-pro.wrtn.ai",
            },
          },
        ],
        address: "경기 성남시 분당구 판교역로 235 에이치스퀘어 N동 7층",
        address_title: "카카오 판교오피스",
      },
    },
  });

  typia.assert(sendTextForm);
};

export const test_kakao_talk_commerce_memo = async () => {
  const kakaoTalkService = new KakaoTalkService({
    kakaoTalkClientId: TestGlobal.env.KAKAO_TALK_CLIENT_ID,
    kakaoTalkClientSecret: TestGlobal.env.KAKAO_TALK_CLIENT_SECRET,
    kakaoTalkRefreshToken: TestGlobal.env.KAKAO_TALK_TEST_REFRESH_TOKEN,
  });

  /**
   * 커머스 메시지 발송.
   */
  const sendTextForm = await kakaoTalkService.memo({
    props: {
      template_object: {
        object_type: "commerce",
        content: {
          title: "Ivory long dress (4 Color)",
          image_url:
            "https://mud-kage.kakao.com/dn/RY8ZN/btqgOGzITp3/uCM1x2xu7GNfr7NS9QvEs0/kakaolink40_original.png",
          image_width: 640,
          image_height: 640,
          link: {
            web_url: "https://studio-pro.wrtn.ai",
            mobile_web_url: "https://studio-pro.wrtn.ai",
            android_execution_params: "contentId=100",
            ios_execution_params: "contentId=100",
          },
        },
        commerce: {
          regular_price: 208800,
          discount_price: 146160,
          discount_rate: 30,
        },
        buttons: [
          {
            title: "구매하기",
            link: {
              web_url: "https://studio-pro.wrtn.ai",
              mobile_web_url: "https://studio-pro.wrtn.ai",
              android_execution_params: "contentId=100&buy=true",
              ios_execution_params: "contentId=100&buy=true",
            },
          },
          {
            title: "공유하기",
            link: {
              web_url: "https://studio-pro.wrtn.ai",
              mobile_web_url: "https://studio-pro.wrtn.ai",
              android_execution_params: "contentId=100&share=true",
              ios_execution_params: "contentId=100&share=true",
            },
          },
        ],
      },
    },
  });

  typia.assert(sendTextForm);
};

export const test_kakao_talk_commerce_memo_with_redirect_url = async () => {
  const kakaoTalkService = new KakaoTalkService({
    kakaoTalkClientId: TestGlobal.env.KAKAO_TALK_CLIENT_ID,
    kakaoTalkClientSecret: TestGlobal.env.KAKAO_TALK_CLIENT_SECRET,
    kakaoTalkRefreshToken: TestGlobal.env.KAKAO_TALK_TEST_REFRESH_TOKEN,
  });

  /**
   * 커머스 메시지 발송.
   */
  const sendTextForm = await kakaoTalkService.memo({
    props: {
      template_object: {
        object_type: "commerce",
        content: {
          title: "리다이렉트 URL 테스트",
          image_url:
            "https://mud-kage.kakao.com/dn/RY8ZN/btqgOGzITp3/uCM1x2xu7GNfr7NS9QvEs0/kakaolink40_original.png",
          image_width: 640,
          image_height: 640,
          link: {
            web_url: "https://www.naver.com",
            mobile_web_url: "https://www.naver.com",
            android_execution_params: "contentId=100",
            ios_execution_params: "contentId=100",
          },
        },
        commerce: {
          regular_price: 208800,
          discount_price: 146160,
          discount_rate: 30,
        },
        buttons: [
          {
            title: "구매하기",
            link: {
              web_url: "https://www.naver.com",
              mobile_web_url: "https://www.naver.com",
              android_execution_params: "contentId=100&buy=true",
              ios_execution_params: "contentId=100&buy=true",
            },
          },
          {
            title: "공유하기",
            link: {
              web_url: "https://www.naver.com",
              mobile_web_url: "https://www.naver.com",
              android_execution_params: "contentId=100&share=true",
              ios_execution_params: "contentId=100&share=true",
            },
          },
        ],
      },
    },
  });

  typia.assert(sendTextForm);
};
