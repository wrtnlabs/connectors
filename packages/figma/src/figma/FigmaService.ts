import axios from "axios";
import { IFigmaService } from "../structures/IFigmaService";

export class FigmaService {
  constructor(private readonly props: IFigmaService.IProps) {}

  /**
   * Figma Service.
   *
   * Import Figma files
   */
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

  /**
   * Figma Service.
   *
   * Write a comment
   */
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

  /**
   * Figma Service.
   *
   * Get Figma comments
   */
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

  /**
   * Figma Service.
   *
   * Get all canvases of a specific project
   *
   * Canvases are Figma files managed by a specific team.
   *
   * This connector allows users to see which canvases are managed within their Figma team, along with their canvas names and thumbnail links.
   */
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

  /**
   * Figma Service.
   *
   * Retrieve team-level statistics
   */
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

  /**
   * Figma Service.
   *
   * Search for projects within a team
   *
   * As an argument, it should receive teamId, which is the team ID, and can be found by looking at the URL path of figma.
   * When accessing the link `https://www.figma.com/files/team`, a number is automatically added after the `team` keyword, which is the team ID.
   * A user can belong to multiple teams, so if you do not want to automate the search for these projects, you need to get a different team ID.
   */
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
    const url = `https://api.figma.com/v1/oauth/refresh`;
    const res = await axios.post(
      url,
      {
        client_id: this.props.figmaClientId,
        client_secret: this.props.figmaClientSecret,
        refresh_token: this.props.figmaRefreshToken,
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
