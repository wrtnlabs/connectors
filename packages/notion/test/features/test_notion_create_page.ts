import { NotionService } from "@wrtnlabs/connector-notion/lib/notion/NotionService";
import { TestGlobal } from "../TestGlobal";
import { randomUUID } from "crypto";

export const test_notion_create_page = async () => {
  const notionService = new NotionService({
    notionApiKey: TestGlobal.env.NOTION_TEST_SECRET,
  });

  const page = await notionService.createPageByMarkdown({
    parentPageId: "804989a1bb91410db6539034b212ebf5",
    title: randomUUID(),
    markdown: `# Hello, World!`,
  });

  if ("body" in page) {
    throw new Error(page.body);
  }

  await notionService.createFile({
    file: {
      external: {
        url: "https://fe-web-assets.wow.wrtn.ai/og-image.png",
      },
    },
    pageId: page.id,
  });

  await notionService.createEmbed({
    embed: {
      url: "https://fe-web-assets.wow.wrtn.ai/og-image.png",
    },
    pageId: page.id,
  });

  await notionService.createBookmark({
    bookmark: {
      url: "https://fe-web-assets.wow.wrtn.ai/og-image.png",
    },
    pageId: page.id,
  });

  await notionService.createImage({
    image: {
      external: {
        url: "https://velog.velcdn.com/images/bryant/post/4615e070-ebc7-4e2c-93e6-f915ba0f54c8/image.png",
      },
    },
    pageId: page.id,
  });

  await notionService.createVideo({
    video: {
      external: {
        url: "https://www.youtube.com/watch?v=55V-DiFVbJE&list=PL5S9DUu9MPplAmM_bZ4fIsdpYeK92fdUX",
      },
    },
    pageId: page.id,
  });

  await notionService.createPdf({
    pdf: {
      external: {
        url: `https://studio-api-bucket.s3.ap-northeast-2.amazonaws.com/11.%E1%84%92%E1%85%A1%E1%86%AB%E1%84%80%E1%85%AE%E1%86%A8%E1%84%8B%E1%85%A5%E1%84%92%E1%85%A1%E1%86%A8%E1%84%80%E1%85%AA.pdf`,
      },
    },
    pageId: page.id,
  });

  // await notionService.createAudio( {
  //   audio: {
  //     external: {
  //       url: "https://www.youtube.com/watch?v=55V-DiFVbJE&list=PL5S9DUu9MPplAmM_bZ4fIsdpYeK92fdUX",
  //     },
  //   },
  //   pageId: page.id,
  // });

  await notionService.createCode({
    code: {
      language: "typescript",
      rich_text: [
        {
          text: {
            content: "console.log(1);\nconsole.log(2);",
          },
        },
      ],
    },
    pageId: page.id,
  });

  await notionService.createEquation({
    equation: {
      expression: "y = 2x",
    },
    pageId: page.id,
  });

  await notionService.createDivider({
    divider: {},
    pageId: page.id,
  });

  // await notionService.createBreadcrumb(
  //
  //   {
  //     breadcrumb: {},
  //     pageId: page.id,
  //   },
  // );

  await notionService.createTableOfContents({
    table_of_contents: {
      color: "blue",
    },
    pageId: page.id,
  });

  await notionService.createLinkToPage({
    link_to_page: {
      page_id: page.id,
    },
    pageId: page.id,
  });

  // await notionService.createTableRow(
  //
  //   {
  //     table_row: {
  //       cells: [[{}]],
  //     },
  //     pageId: page.id,
  //   },
  // );

  // await notionService.createTable( {
  //   ...typia.random<INotion.ICreateChildContentTypeTableInput>(),
  //   pageId: page.id,
  // });

  // await notionService.createColumnList(
  //
  //   {
  //     ...typia.random<INotion.ICreateChildContentTypeColumnListInput>(),
  //     pageId: page.id,
  //   },
  // );

  // await notionService.createColumn( {
  //   ...typia.random<INotion.ICreateChildContentTypeColumnInput>(),
  //   pageId: page.id,
  // });

  await notionService.createToggle({
    toggle: {
      rich_text: [
        {
          text: {
            content: "hello, quote",
          },
        },
      ],
      children: [],
    },
    pageId: page.id,
  });

  // Cannot create a template block using the public API.
  // await notionService.createTemplate(
  //
  //   {
  //     template: {
  //       rich_text: [
  //         {
  //           text: {
  //             content: "hello, template",
  //           },
  //         },
  //       ],
  //     },
  //     pageId: page.id,
  //   },
  // );

  // await notionService.createCallout(
  //
  //   {
  //     callout: {
  //       icon: EmojiRequest
  //     },
  //     pageId: page.id,
  //   },
  // );

  // await notionService.createSyncedBlock(
  //
  //   {
  //     ...typia.random<INotion.ICreateChildContentTypeSyncedBlockInput>(),
  //     pageId: page.id,
  //   },
  // );
};
