import axios from "axios";
import { IZoomService } from "../structures/IZoomService";

export class ZoomService {
  constructor(private readonly props: IZoomService.IProps) {}

  /**
   * Zoom Service.
   *
   * Create a zoom meeting
   */
  async createMeeting(
    input: IZoomService.ICreateMeetingInput,
  ): Promise<IZoomService.ICreateMeetingOutput> {
    const baseUrl = "https://api.zoom.us/v2" as const;
    const encodedUserId = input.userId;
    const apiUrl = `${baseUrl}/users/${encodedUserId}/meetings` as const;
    const token = this.props.zoomSecretKey;

    try {
      const res = await axios.post(
        apiUrl,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data;
    } catch (err) {
      console.log("err", err);
      throw err;
    }
  }
}
