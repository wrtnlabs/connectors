import axios from "axios";
import { IFigmaService } from "../structures/IFigmaService";

export class FigmaService {
  constructor(private readonly props: IFigmaService.IProps) {}

  async getFiles(
    input: IFigmaService.IReadFileInput,
  ): Promise<IFigmaService.IReadFileOutput> {
    try {
      const { fileKey, ...getFileQueryParams } = input;
      const accessToken = await this.refresh();

      const queryParams = Object.entries(getFileQueryParams)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

      const res = await axios.get(
        `https://api.figma.com/v1/files/${fileKey}?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return res.data;
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  async addComment(input: IFigmaService.IAddCommentInput) {
    try {
      const { fileKey, ...requestBody } = input;
      const accessToken = await this.refresh();

      const res = await axios.post(
        `https://api.figma.com/v1/files/${fileKey}/comments`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return res.data;
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  async getComments(
    input: IFigmaService.IReadCommentInput,
  ): Promise<IFigmaService.IReadCommentOutput> {
    try {
      const { fileKey, ...getCommentQueryParam } = input;
      const accessToken = await this.refresh();

      const queryParams = Object.entries(getCommentQueryParam)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

      const res = await axios.get(
        `https://api.figma.com/v1/files/${fileKey}/comments?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return res.data;
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  async getProjectCanvas(input: {
    projectId: string;
  }): Promise<IFigmaService.IGetProjectFileOutput> {
    try {
      const { projectId } = input;
      const url = `https://api.figma.com/v1/projects/${projectId}/files`;
      const accessToken = await this.refresh();

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return res.data;
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  async getStatistics(
    input: IFigmaService.IGetProjectStatisticsInput,
  ): Promise<IFigmaService.IGetStatisticsOutput[]> {
    try {
      const { team } = input;
      return await Promise.all(
        team.projects.map(async (project) => {
          const projectDetail = await this.getProjectCanvas({
            projectId: project.id,
          });

          const canvasList = await Promise.all(
            projectDetail.files.map(async (canvas) => {
              const canvasDetail = await this.getComments({
                fileKey: canvas.key,
                as_md: input.as_md,
              });

              const comments = canvasDetail.comments;
              const users = comments.map((el) => el.user.handle);

              const statistics = {
                users: Array.from(new Set(users)),
                counts: users.reduce<Record<string, number>>((acc, cur) => {
                  if (!acc[cur]) {
                    acc[cur] = 1;
                  } else {
                    acc[cur] += 1;
                  }

                  return acc;
                }, {}),
              };
              return { ...canvas, comments, statistics };
            }),
          );

          return { ...project, canvasList };
        }),
      );
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  async getProjects(
    input: IFigmaService.IGetProjectInput,
  ): Promise<IFigmaService.IGetProejctOutput> {
    const url = `https://api.figma.com/v1/teams/${input.teamId}/projects?branch_data=true`;
    const accessToken = await this.refresh();

    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data;
  }

  private async refresh(): Promise<string> {
    const url = `https://www.figma.com/api/oauth/refresh`;
    const res = await axios.post(
      url,
      {
        client_id: this.props.clientId,
        client_secret: this.props.clientSecret,
        refresh_token: this.props.secret,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    return res.data.access_token;
  }
}
