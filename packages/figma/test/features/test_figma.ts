import { FigmaService } from "@wrtnlabs/connector-figma";
import typia from "typia";
import { TestGlobal } from "../TestGlobal";

export const test_figma_read_file = async () => {
  const figmaService = new FigmaService({
    figmaClientId: TestGlobal.env.FIGMA_CLIENT_ID,
    figmaClientSecret: TestGlobal.env.FIGMA_CLIENT_SECRET,
    figmaRefreshToken: TestGlobal.env.FIGMA_TEST_SECRET,
  });

  /**
   * read file API
   */
  const readFileEvent = await figmaService.getFiles({
    fileKey: TestGlobal.env.FIGMA_TEST_FILE_KEY,
  });

  typia.assert(readFileEvent);
};

export const test_figma_read_comment = async () => {
  const figmaService = new FigmaService({
    figmaClientId: TestGlobal.env.FIGMA_CLIENT_ID,
    figmaClientSecret: TestGlobal.env.FIGMA_CLIENT_SECRET,
    figmaRefreshToken: TestGlobal.env.FIGMA_TEST_SECRET,
  });

  /**
   * read comment API
   */
  const readCommentEvent = await figmaService.getComments({
    fileKey: TestGlobal.env.FIGMA_TEST_FILE_KEY,
    as_md: true,
  });

  typia.assert(readCommentEvent);
  return readCommentEvent;
};

export const test_figma_add_comment = async () => {
  const figmaService = new FigmaService({
    figmaClientId: TestGlobal.env.FIGMA_CLIENT_ID,
    figmaClientSecret: TestGlobal.env.FIGMA_CLIENT_SECRET,
    figmaRefreshToken: TestGlobal.env.FIGMA_TEST_SECRET,
  });

  /**
   * add comment API
   */
  const addCommentEvent = await figmaService.addComment({
    fileKey: TestGlobal.env.FIGMA_TEST_FILE_KEY,
    message: typia.random<string>(),
  });

  typia.assert(addCommentEvent);

  /**
   * 방금 추가한 댓글이 조회되어야 한다.
   */
  const readCommentEvent = await test_figma_read_comment();
  typia.assert(
    readCommentEvent.comments.find((el) => el.id === addCommentEvent.id)!,
  );
};

export const test_figma_get_projects = async () => {
  const figmaService = new FigmaService({
    figmaClientId: TestGlobal.env.FIGMA_CLIENT_ID,
    figmaClientSecret: TestGlobal.env.FIGMA_CLIENT_SECRET,
    figmaRefreshToken: TestGlobal.env.FIGMA_TEST_SECRET,
  });

  const team = await figmaService.getProjects({
    teamId: "1379663189749043465",
  });

  typia.assert(team);
  return team;
};

export const test_figma_get_project_files = async () => {
  const figmaService = new FigmaService({
    figmaClientId: TestGlobal.env.FIGMA_CLIENT_ID,
    figmaClientSecret: TestGlobal.env.FIGMA_CLIENT_SECRET,
    figmaRefreshToken: TestGlobal.env.FIGMA_TEST_SECRET,
  });

  const team = await test_figma_get_projects();

  for await (const project of team.projects) {
    const files = await figmaService.getProjectCanvas({
      projectId: project.id,
    });

    typia.assert(files);
  }
};

export const test_get_statistics = async () => {
  const figmaService = new FigmaService({
    figmaClientId: TestGlobal.env.FIGMA_CLIENT_ID,
    figmaClientSecret: TestGlobal.env.FIGMA_CLIENT_SECRET,
    figmaRefreshToken: TestGlobal.env.FIGMA_TEST_SECRET,
  });

  const team = await figmaService.getProjects({
    teamId: "1379663189749043465",
  });

  const res = await figmaService.getStatistics({
    as_md: true,
    teamId: "1379663189749043465",
    team,
  });

  typia.assert(res);
};
