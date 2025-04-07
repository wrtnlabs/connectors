import axios from "axios";
import typia from "typia";
import { IZoomService } from "../../src/structures/IZoomService";
import { TestGlobal } from "../TestGlobal";
import { ZoomService } from "../../src/zoom/ZoomService";

export const test_zoom_create_meeting = async () => {
  /**
   * 토큰 만료 시간이 1시간이기 때문에 차라리 refresh token을 configuration에 넣고 테스트에 활용.
   */
  const refreshToken = TestGlobal.env.ZOOM_TEST_REFRESH_TOKEN;
  const authorizationCode = TestGlobal.env.ZOOM_TEST_AUTHORIZATION_CODE;
  const authorizationHeader = TestGlobal.env.ZOOM_TEST_AUTHORIZATION_HEADER;

  const refreshResponse = await axios.post(
    `https://zoom.us/oauth/token?code=${authorizationCode}&scope=meeting:write:admin,meeting:write`,
    {
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    },
    {
      headers: {
        Authorization: authorizationHeader,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  const access_token = refreshResponse.data.access_token;

  const zoomService = new ZoomService({
    zoomSecretKey: access_token,
  });

  const requestBody: IZoomService.ICreateMeetingInput = {
    userId: "studio@wrtn.io",
  };

  const res = await zoomService.createMeeting(requestBody);

  typia.assert(res);
};
