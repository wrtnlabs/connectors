import axios from "axios";
import { BlockObjectRequest } from "@notionhq/client/build/src/api-endpoints";
import { markdownToBlocks } from "@tryfabric/martian";
import { NotionToMarkdown } from "notion-to-md";
import typia from "typia";
import { INotionService } from "../structures/INotionService";
import { Client } from "@notionhq/client";
import { retry } from "@wrtnlabs/connector-shared";

export class NotionService {
  constructor(private readonly props: INotionService.IProps) {}

  /**
   * Notion Service.
   *
   * Delete a block
   *
   * Sets a Block object, including page blocks,
   * to archived: true using the ID specified. Note: in the Notion UI application, this moves the block to the "Trash" where it can still be accessed and restored.
   */
  async deleteBlock(input: INotionService.IDeleteBlockInput): Promise<void> {
    const { block_id } = input;
    const headers = await this.getHeaders();
    const url = `https://api.notion.com/v1/blocks/${block_id}`;
    await axios.delete(url, { headers: headers });
  }

  /**
   * Notion Service.
   *
   * Append an file type child node
   *
   * Notion is a very complex type, so you have to create a page in a block coding manner.
   * Therefore, this connector is designed to create a page by taking only the page ID and one block of the corresponding block and continuously adding it to the bottom.
   * The type of block you can put in here is `file`.
   *
   * Uploading a file exposes it to the Notion page as an icon in the file format, but there is no Preview.
   * If you want the internal elements to be seen as soon as you enter the page, it is better to create the image, pdf format for each format, and consider embed for other formats.
   *
   * Calling this connector requires the correct page ID, so it should only be called if you have previously created a page to obtain that ID, viewed the page, or obtained a link or page ID from the user in advance.
   */
  async createFile(
    input: INotionService.ICreateChildContentTypeFileInput,
  ): Promise<void> {
    try {
      const { pageId, ...rest } = input;
      const notion = await this.createClient();
      await notion.blocks.children.append({
        block_id: pageId,
        children: [this.removeChildren(rest)],
      });
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * Notion Service.
   *
   * Append an embed type child node
   *
   * Notion is a very complex type, so you have to create a page in a block coding manner.
   * Therefore, this connector is designed to create a page by taking only the page ID and one block of the corresponding block and continuously adding it to the bottom.
   * The type of block you can put in here is `embed`.
   *
   * This is suitable when you want an internal element to be rendered immediately, such as an imprame within a page.
   *
   * Calling this connector requires the correct page ID, so it should only be called if you have previously created a page to obtain that ID, viewed the page, or obtained a link or page ID from the user in advance.
   */
  async createEmbed(
    input: INotionService.ICreateChildContentTypeEmbedInput,
  ): Promise<void> {
    try {
      const { pageId, ...rest } = input;
      const notion = await this.createClient();
      await notion.blocks.children.append({
        block_id: pageId,
        children: [this.removeChildren(rest)],
      });
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * Notion Service.
   *
   * Append an bookmark type child node
   *
   * Notion is a very complex type, so you have to create a page in a block coding manner.
   * Therefore, this connector is designed to create a page by taking only the page ID and one block of the corresponding block and continuously adding it to the bottom.
   * The type of block you can put in here is `bookmark`.
   *
   * Bookmarks are visually better and more organized because they have previews, images, and explanations than just saving url as text.
   *
   * Calling this connector requires the correct page ID, so it should only be called if you have previously created a page to obtain that ID, viewed the page, or obtained a link or page ID from the user in advance.
   */
  async createBookmark(
    input: INotionService.ICreateChildContentTypeBookmarkInput,
  ): Promise<void> {
    try {
      const { pageId, ...rest } = input;
      const notion = await this.createClient();
      await notion.blocks.children.append({
        block_id: pageId,
        children: [this.removeChildren(rest)],
      });
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * Notion Service.
   *
   * Append an image type child node
   *
   * Notion is a very complex type, so you have to create a page in a block coding manner.
   * Therefore, this connector is designed to create a page by taking only the page ID and one block of the corresponding block and continuously adding it to the bottom.
   * The type of block you can put in here is `image`.
   *
   * image file's extension is one of: 'bmp', 'gif', 'heic', 'jpg', 'jpeg', 'png', 'svg', 'tif', 'tiff'.
   *
   * Calling this connector requires the correct page ID, so it should only be called if you have previously created a page to obtain that ID, viewed the page, or obtained a link or page ID from the user in advance.
   */
  async createImage(
    input: INotionService.ICreateChildContentTypeImageInput,
  ): Promise<void> {
    try {
      const { pageId, ...rest } = input;
      const notion = await this.createClient();
      await notion.blocks.children.append({
        block_id: pageId,
        children: [this.removeChildren(rest)],
      });
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * Notion Service.
   *
   * Append an video type child node
   *
   * Notion is a very complex type, so you have to create a page in a block coding manner.
   * Therefore, this connector is designed to create a page by taking only the page ID and one block of the corresponding block and continuously adding it to the bottom.
   * The type of block you can put in here is `video`.
   *
   * video file must be one of: 'amv' ,'asf' ,'avi' ,'f4v' ,'flv' ,'gifv' ,'mkv' ,'mov' ,'mpg' ,'mpeg' ,'mpv' ,'mp4' ,'m4v' ,'qt' ,'wmv'
   * OR
   * YouTube video links that include embed or watch.
   * E.g. https://www.youtube.com/watch?v=[id], https://www.youtube.com/embed/[id]
   *
   * Calling this connector requires the correct page ID, so it should only be called if you have previously created a page to obtain that ID, viewed the page, or obtained a link or page ID from the user in advance.
   */
  async createVideo(
    input: INotionService.ICreateChildContentTypeVideoInput,
  ): Promise<void> {
    try {
      const { pageId, ...rest } = input;
      const notion = await this.createClient();
      await notion.blocks.children.append({
        block_id: pageId,
        children: [this.removeChildren(rest)],
      });
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * Notion Service.
   *
   * Append an pdf type child node
   *
   * Notion is a very complex type, so you have to create a page in a block coding manner.
   * Therefore, this connector is designed to create a page by taking only the page ID and one block of the corresponding block and continuously adding it to the bottom.
   * The type of block you can put in here is `pdf`.
   *
   * Calling this connector requires the correct page ID, so it should only be called if you have previously created a page to obtain that ID, viewed the page, or obtained a link or page ID from the user in advance.
   */
  async createPdf(
    input: INotionService.ICreateChildContentTypePdfInput,
  ): Promise<void> {
    try {
      const { pageId, ...rest } = input;
      const notion = await this.createClient();
      await notion.blocks.children.append({
        block_id: pageId,
        children: [this.removeChildren(rest)],
      });
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * Notion Service.
   *
   * Append an code type child node
   *
   * Notion is a very complex type, so you have to create a page in a block coding manner.
   * Therefore, this connector is designed to create a page by taking only the page ID and one block of the corresponding block and continuously adding it to the bottom.
   * The type of block you can put in here is `code`.
   *
   * Calling this connector requires the correct page ID, so it should only be called if you have previously created a page to obtain that ID, viewed the page, or obtained a link or page ID from the user in advance.
   */
  async createCode(
    input: INotionService.ICreateChildContentTypeCodeInput,
  ): Promise<void> {
    try {
      const { pageId, ...rest } = input;
      const notion = await this.createClient();
      await notion.blocks.children.append({
        block_id: pageId,
        children: [rest as any],
      });
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * Notion Service.
   *
   * Append an equation type child node
   *
   * Notion is a very complex type, so you have to create a page in a block coding manner.
   * Therefore, this connector is designed to create a page by taking only the page ID and one block of the corresponding block and continuously adding it to the bottom.
   * The type of block you can put in here is `equation`.
   *
   * Calling this connector requires the correct page ID, so it should only be called if you have previously created a page to obtain that ID, viewed the page, or obtained a link or page ID from the user in advance.
   */
  async createEquation(
    input: INotionService.ICreateChildContentTypeEquationInput,
  ): Promise<void> {
    try {
      const { pageId, ...rest } = input;
      const notion = await this.createClient();
      await notion.blocks.children.append({
        block_id: pageId,
        children: [this.removeChildren(rest)],
      });
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * Notion Service.
   *
   * Append an divider type child node
   *
   * Notion is a very complex type, so you have to create a page in a block coding manner.
   * Therefore, this connector is designed to create a page by taking only the page ID and one block of the corresponding block and continuously adding it to the bottom.
   * The type of block you can put in here is `divider`.
   *
   * Calling this connector requires the correct page ID, so it should only be called if you have previously created a page to obtain that ID, viewed the page, or obtained a link or page ID from the user in advance.
   */
  async createDivider(
    input: INotionService.ICreateChildContentTypeDividerInput,
  ): Promise<void> {
    try {
      const { pageId, ...rest } = input;
      const notion = await this.createClient();
      await notion.blocks.children.append({
        block_id: pageId,
        children: [this.removeChildren(rest)],
      });
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * Notion Service.
   *
   * Append an table_of_contents type child node
   *
   * Notion is a very complex type, so you have to create a page in a block coding manner.
   * Therefore, this connector is designed to create a page by taking only the page ID and one block of the corresponding block and continuously adding it to the bottom.
   * The type of block you can put in here is `table_of_contents`.
   *
   * Calling this connector requires the correct page ID, so it should only be called if you have previously created a page to obtain that ID, viewed the page, or obtained a link or page ID from the user in advance.
   */
  async createTableOfContents(
    input: INotionService.ICreateChildContentTypeTableOfContentsInput,
  ): Promise<void> {
    try {
      const { pageId, ...rest } = input;
      const notion = await this.createClient();
      await notion.blocks.children.append({
        block_id: pageId,
        children: [this.removeChildren(rest)],
      });
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * Notion Service.
   *
   * Append an link_to_page type child node
   *
   * Notion is a very complex type, so you have to create a page in a block coding manner.
   * Therefore, this connector is designed to create a page by taking only the page ID and one block of the corresponding block and continuously adding it to the bottom.
   * The type of block you can put in here is `link_to_page`.
   *
   * Calling this connector requires the correct page ID, so it should only be called if you have previously created a page to obtain that ID, viewed the page, or obtained a link or page ID from the user in advance.
   */
  async createLinkToPage(
    input: INotionService.ICreateChildContentTypeLinkToPageInput,
  ): Promise<void> {
    try {
      const { pageId, ...rest } = input;
      const notion = await this.createClient();
      await notion.blocks.children.append({
        block_id: pageId,
        children: [this.removeChildren(rest)],
      });
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * Notion Service.
   *
   * Append an toggle type child node
   *
   * Notion is a very complex type, so you have to create a page in a block coding manner.
   * Therefore, this connector is designed to create a page by taking only the page ID and one block of the corresponding block and continuously adding it to the bottom.
   * The type of block you can put in here is `toggle`.
   *
   * Calling this connector requires the correct page ID, so it should only be called if you have previously created a page to obtain that ID, viewed the page, or obtained a link or page ID from the user in advance.
   */
  async createToggle(
    input: INotionService.ICreateChildContentTypeToggleInput,
  ): Promise<void> {
    try {
      const { pageId, ...rest } = input;
      const notion = await this.createClient();
      await notion.blocks.children.append({
        block_id: pageId,
        children: [this.removeChildren(rest)],
      });
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  async createPage(
    input: INotionService.ICreatePageInput,
  ): Promise<INotionService.ICreatePageOutput> {
    try {
      const notion = await this.createClient();
      const res = await notion.pages.create({
        parent: { type: "page_id", page_id: input.parentPageId },
        properties: { title: { title: [{ text: { content: input.title } }] } },
      });
      const pageId = res.id;

      if (!pageId) {
        throw new Error("Failed Create Page");
      }

      const uuid = pageId.replaceAll("-", "");
      return {
        id: pageId,
        title: input.title,
        link: `https://www.notion.so/${uuid}`,
      };
    } catch (error) {
      if (typia.is<INotionService.Common.IError>(error)) {
        return error;
      }

      console.error(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * Notion Service.
   *
   * Read the contents of a Notion page.
   * Reads the contents of a Notion page in Markdown format.
   *
   * Read Notion page contents
   */
  async readPageContents(
    input: INotionService.IReadPageContentInput,
  ): Promise<INotionService.IReadPageContentOutput> {
    try {
      const notion = await this.createClient();
      const n2m = new NotionToMarkdown({
        notionClient: notion,
        config: {
          parseChildPages: false, // default: parseChildPages
        },
      });
      const mdBlock = await n2m.pageToMarkdown(input.pageId);
      const markDown = n2m.toMarkdownString(mdBlock);

      if (!markDown.parent) {
        throw new Error("Parent not found.");
      }

      return {
        content: markDown.parent,
      };
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Notion Service.
   *
   * Retrieve a list of all pages in your Notion workspace
   */
  async readPageList(): Promise<INotionService.IReadPageOutput[]> {
    try {
      const headers = await this.getHeaders();
      const res = await axios.post(
        `https://api.notion.com/v1/search`,
        {
          filter: {
            value: "page",
            property: "object",
          },
        },
        {
          headers: headers,
        },
      );

      const pageList = res.data.results.filter(
        (page: any) => page.parent.type !== "database_id",
      );
      const pageOutput: INotionService.IReadPageOutput[] = [];

      for (const page of pageList) {
        const uuid = page.id.replaceAll("-", "");
        const pageInfo: INotionService.IReadPageOutput = {
          pageId: page.id,
          title:
            page.properties.title.title.length === 0
              ? "제목없음"
              : page.properties.title.title[0].plain_text,
          link: `https://notion.so/${uuid}`,
        };
        pageOutput.push(pageInfo);
      }

      return pageOutput;
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * Notion Service.
   *
   * Retrieves database information to create items in the database
   */
  async getDatabaseInfo(input: {
    databaseId: string;
  }): Promise<INotionService.IDatabaseInfo> {
    const { databaseId } = input;
    try {
      /**
       * notion sdk의 database.retrieve method를 사용하여 properties의 정보를 받아올 수 있지만
       * database의 title을 가져올 수 없음.
       */
      const headers = await this.getHeaders();
      const res = await axios.get(
        `https://api.notion.com/v1/databases/${databaseId}`,
        {
          headers: headers,
        },
      );

      const database = res.data;
      return {
        id: databaseId,
        title: database.title[0].plain_text ?? "제목 없음",
        url: database.url,
        properties: database.properties,
      };
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * Notion Service.
   *
   * Query the database list to create items in the database
   */
  async getDatabaseListInfo(): Promise<INotionService.IDatabaseInfo[]> {
    try {
      const notion = await this.createClient();
      const searchResult = await notion.search({});
      const databaseIds = searchResult.results
        .filter((result) => result.object === "database")
        .map((result) => result.id);

      const databaseListInfo: INotionService.IDatabaseInfo[] = [];
      for (const databaseId of databaseIds) {
        const databaseInfo = await this.getDatabaseInfo({ databaseId });
        databaseListInfo.push(databaseInfo);
      }
      return databaseListInfo;
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  //  async  createDatabaseItem(
  //   input: INotion.ICreateDatabaseItemInput,
  //   databaseId: string,
  // ): Promise<INotion.IDatabaseItemOutput> {
  //   try {
  //     const databaseInfo = await this.getDatabaseInfo(
  //
  //       databaseId,
  //     );
  //     /**
  //      * 데이터베이스에 아이템을 추가할 때 필요한 데이터베이스별 프로퍼티 정보
  //      */
  //     const properties = formattingDatabaseProperties(
  //       input,
  //       databaseInfo.properties,
  //     );

  //     const headers = await this.getHeaders();
  //     const blocks = markdownToBlocks(input.markdown);

  //     /**
  //      * 데이터베이스에 페이지 생성
  //      */
  //     const res = await axios.post(
  //       "https://api.notion.com/v1/pages",
  //       {
  //         parent: { database_id: databaseId },
  //         properties: properties,
  //         children: blocks,
  //       },
  //       { headers: headers },
  //     );

  //     const createdDatabaseItem: INotion.IDatabaseItemOutput = res.data;
  //     return createdDatabaseItem;
  //   } catch (error) {
  //     console.error(JSON.stringify(error));
  //     throw error;
  //   }
  // }

  //  async  updateDatabaseItem(
  //   input: INotion.IUpdateDatabaseItemInput,
  //   databaseId: string,
  // ): Promise<INotion.IDatabaseItemOutput> {
  //   try {
  //     const databaseInfo = await this.getDatabaseInfo(
  //
  //       databaseId,
  //     );
  //     /**
  //      * 업데이트 할 데이터베이스 아이템 프로퍼티 값
  //      */
  //     const properties = formattingDatabaseProperties(
  //       input,
  //       databaseInfo.properties,
  //     );

  //     const headers = await this.getHeaders();
  //     /**
  //      *
  //      * 데이터베이스 아이템 업데이트
  //      */
  //     const res = await axios.patch(
  //       `https://api.notion.com/v1/pages/${input.pageId}`,
  //       {
  //         properties: properties,
  //       },
  //       { headers: headers },
  //     );

  //     /**
  //      * 데이터베이스 안의 페이지 내용 업데이트
  //      */
  //     const response = await axios.get(
  //       `https://api.notion.com/v1/blocks/${input.pageId}/children`,
  //       {
  //         headers: headers,
  //       },
  //     );

  //     const firstBlockId = response.data.results[0].id;
  //     const originalContent =
  //       response.data.results[0].paragraph.rich_text[0].plain_text;
  //     await axios.patch(
  //       `https://api.notion.com/v1/blocks/${firstBlockId}`,
  //       {
  //         paragraph: {
  //           rich_text: [
  //             {
  //               type: "text",
  //               text: {
  //                 content: input.content ?? originalContent,
  //               },
  //             },
  //           ],
  //         },
  //       },
  //       { headers: headers },
  //     );

  //     const updatedDatabaseItem: INotion.IDatabaseItemOutput = res.data;
  //     return updatedDatabaseItem;
  //   } catch (error) {
  //     console.error(JSON.stringify(error));
  //     throw error;
  //   }
  // }

  /**
   * Notion Service.
   *
   * Retrieve the list of users in the workspace
   */
  async getUsers(): Promise<INotionService.IUserOutput[]> {
    try {
      const headers = await this.getHeaders();
      const people = await axios.get(`https://api.notion.com/v1/users`, {
        headers: headers,
      });
      const userInfoList: INotionService.IUser[] = people.data.results;
      const users: INotionService.IUserOutput[] = [];

      for (const userInfo of userInfoList) {
        const user: INotionService.IUserOutput = {
          id: userInfo.id,
          name: userInfo.name,
        };

        users.push(user);
      }
      return users;
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * Notion Service.
   *
   * Search for pages by title
   */
  async findPageByTitle(
    input: INotionService.IFindPageOrDatabaseItemInput,
  ): Promise<INotionService.IFindPageByTitleOutput> {
    const headers = await this.getHeaders();
    const res = await axios.post(
      `https://api.notion.com/v1/search`,
      {
        query: input.title,
        filter: {
          value: "page",
          property: "object",
        },
      },
      {
        headers: headers,
      },
    );
    const pageOutput: INotionService.IFindPageByTitleOutput =
      res.data.results[0];
    if (!pageOutput) {
      throw new Error("Cannot Find Page by title");
    }
    return pageOutput;
  }

  /**
   * Notion Service.
   *
   * Retrieve a list of items that exist in a table database
   */
  async findDatabaseItemList(input: {
    databaseId: string;
  }): Promise<INotionService.IDatabaseItemOutput[]> {
    const { databaseId } = input;
    try {
      const headers = await this.getHeaders();
      const res = await axios.post(
        `https://api.notion.com/v1/databases/${databaseId}/query`,
        {},
        {
          headers: headers,
        },
      );

      const databaseItemList = res.data.results;
      return databaseItemList;
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * Notion Service.
   *
   * Retrieves an item that exists in a table database
   */
  async findDatabaseItem(
    input: INotionService.IFindDatabaseItemInput,
  ): Promise<INotionService.IDatabaseItemOutput> {
    try {
      const database = await this.getDatabaseInfo({
        databaseId: input.id,
      });

      const propertiesInfo: Record<string, INotionService.DatabaseProperty> =
        database.properties;

      const filters = [];

      for (const key in propertiesInfo) {
        const property = propertiesInfo[key];
        /**
         * 데이터베이스 아이템을 찾을 때 필터 조건으로 가능한 프로퍼티는
         * title, rich_text, email, url, phone_number, number 프로퍼티로 필터 생성 가능
         */
        for (const inputKey in input) {
          /**
           * input의 key로 property의 type과 value를 받음
           * ex) number: 1 , title: "뤼튼" ....
           */
          if (inputKey === property?.type && input[inputKey] !== undefined) {
            const filter = {
              property: property.name,
              [property.type]: { equals: input[inputKey] },
            };
            filters.push(filter);
          }
        }
      }
      const headers = await this.getHeaders();

      const res = await axios.post(
        `https://api.notion.com/v1/databases/${input.id}/query`,
        {
          filter: {
            /**
             * and 조건을 사용해서 입력한 모든 조건이 만족하는 데이터베이스만 찾도록 필터 적용
             * docs: https://developers.notion.com/reference/post-database-query-filter
             */
            and: filters,
          },
        },
        {
          headers: headers,
        },
      );

      const databaseItem = res.data.results[0];
      if (!databaseItem) {
        throw new Error("Cannot Find Database Item for condition");
      }

      return databaseItem;
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * 데이터베이스 아이템 생성 및 업데이트시 프로퍼티 별 형식에 맞추어 프로퍼티 값 적용
   */
  // formattingDatabaseProperties(
  //   input: INotionService.ICreateDatabaseItemInput & {
  //     propertiesInfo: Record<string, INotionService.DatabaseProperty>;
  //   },
  // ): INotionService.IDatabasePropertyInput {
  //   const { propertiesInfo } = input;
  //   const properties: INotionService.IDatabasePropertyInput = {};

  //   for (const [, property] of Object.entries(propertiesInfo)) {
  //     const key = property.name;

  //     // 데이터베이스 아이템 업데이트 시 업데이트 하지 않는 프로퍼티가 있을 수 있음
  //     if (input[key] === undefined) continue;

  //     switch (property.type) {
  //       case "multi_select": {
  //         properties[key] = {
  //           multi_select: input[key].map((item: string) => ({ name: item })),
  //         };
  //         break;
  //       }
  //       case "select": {
  //         properties[key] = { select: { name: input[key] } };
  //         break;
  //       }
  //       case "title": {
  //         properties[key] = { title: [{ text: { content: input[key] } }] };
  //         break;
  //       }
  //       case "rich_text": {
  //         properties[key] = { rich_text: [{ text: { content: input[key] } }] };
  //         break;
  //       }
  //       case "number":
  //       case "email":
  //       case "url":
  //       case "phone_number":
  //       case "checkbox": {
  //         properties[key] = { [property.type]: input[key] };
  //         break;
  //       }
  //       // start는 필수, end는 optional(null 가능)
  //       case "date": {
  //         properties[key] = {
  //           date: { start: input[key].start, end: input[key].end },
  //         };
  //         break;
  //       }
  //       // getUsers() 함수로 부터 받아온 워크스페이스에 속한 사람들 id
  //       case "people": {
  //         properties[key] = {
  //           people: input[key].map((item: string) => ({ id: item })),
  //         };
  //         break;
  //       }
  //     }
  //   }
  //   return properties;
  // }

  /**
   * Notion Service.
   *
   * Append block by markdown format
   *
   * You can add blocks to the page immediately with only the markdown grammar.
   * You can create pages more effectively than other connectors, so you can prioritize this.
   * If there are unique blocks of the note that cannot be created with the grammar of the markdown, it must be associated with other block generation connectors.
   *
   * Since users may not know the markdown grammar, it is more desirable to use the markdown grammar instead of guiding them.
   * Markdown supports text and heading 1, 2, 3, and various grammar such as table or bull list, number list, image attachment, boldface, italics, etc.
   */
  async appendBlocksByMarkdown(
    input: INotionService.IAppendPageByMarkdownInput,
  ): Promise<INotionService.IAppendPageByMarkdownOutput> {
    try {
      const blocks = markdownToBlocks(input.markdown);
      const notion = await this.createClient();
      while (blocks.length !== 0) {
        const blocksToInsert = blocks.splice(0, 100) as BlockObjectRequest[];
        await notion.blocks.children.append({
          block_id: input.pageId,
          children: blocksToInsert,
        });
      }

      const uuid = input.pageId.replaceAll("-", "");
      return { id: input.pageId, link: `https://notion.so/${uuid}` };
    } catch (error) {
      console.log(
        "here",
        typia.validateEquals<INotionService.Common.IError>(error),
      );
      if (typia.is<INotionService.Common.IError>(error)) {
        return error;
      }
      throw error;
    }
  }

  /**
   * Notion Service.
   *
   * Create page by markdown format
   *
   * Receive the markdown text and immediately create it as a notation page.
   * You can create pages more effectively than other connectors, so you can prioritize this.
   * If there are unique blocks of the note that cannot be created with the grammar of the markdown, it must be associated with other block generation connectors.
   *
   * Since users may not know the markdown grammar, it is more desirable to use the markdown grammar instead of guiding them.
   * Markdown supports text and heading 1, 2, 3, and various grammar such as table or bull list, number list, image attachment, boldface, italics, etc.
   *
   * Since Notion prioritizes accessible pages during authentication, creating pages must be sub-pages within the page, which means that there must be a parent page.
   */
  async createPageByMarkdown(
    input: INotionService.ICreatePageByMarkdownInput,
  ): Promise<INotionService.ICreatePageOutput> {
    try {
      const page = await this.createPage(input);
      if (typia.is<INotionService.Common.IError>(page)) {
        return page;
      }

      await this.appendBlocksByMarkdown({
        ...input,
        pageId: page.id,
      });

      const uuid = page.id.replaceAll("-", "");
      return {
        id: page.id,
        title: input.title,
        link: `https://notion.so/${uuid}`,
      };
    } catch (error) {
      throw error;
    }
  }

  // private blocksToMarkdown<T extends Block & { id: string }>(
  //   blocks: T[],
  // ): INotionService.AccurateMarkdownBlock[] {
  //   return blocks.map((block: T) => {
  //     if (block.type === "audio") {
  //     } else if (block.type === "bookmark") {
  //     } else if (block.type === "breadcrumb") {
  //     } else if (block.type === "bulleted_list_item") {
  //       const rich_text = block[block["type"]]["rich_text"];
  //       if (rich_text instanceof Array) {
  //         const text = rich_text
  //           .map((el) => (el.type === "text" ? el.text.content : ""))
  //           .join("");

  //         return { ...block, text };
  //       }
  //     } else if (block.type === "callout") {
  //       const rich_text = block[block["type"]]["rich_text"];
  //       if (rich_text instanceof Array) {
  //         const text = rich_text
  //           .map((el) => (el.type === "text" ? el.text.content : ""))
  //           .join("");

  //         return { ...block, text };
  //       }
  //     } else if (block.type === "code") {
  //       const rich_text = block[block["type"]]["rich_text"];
  //       if (rich_text instanceof Array) {
  //         const text = rich_text
  //           .map((el) => (el.type === "text" ? el.text.content : ""))
  //           .join("");

  //         return { ...block, text };
  //       }
  //     } else if (block.type === "column") {
  //     } else if (block.type === "column_list") {
  //     } else if (block.type === "divider") {
  //     } else if (block.type === "embed") {
  //     } else if (block.type === "equation") {
  //     } else if (block.type === "file") {
  //     } else if (block.type === "heading_1") {
  //       const rich_text = block[block["type"]]["rich_text"];
  //       if (rich_text instanceof Array) {
  //         const text = rich_text
  //           .map((el) => (el.type === "text" ? el.text.content : ""))
  //           .join("");

  //         return { ...block, text };
  //       }
  //     } else if (block.type === "heading_2") {
  //       const rich_text = block[block["type"]]["rich_text"];
  //       if (rich_text instanceof Array) {
  //         const text = rich_text
  //           .map((el) => (el.type === "text" ? el.text.content : ""))
  //           .join("");

  //         return { ...block, text };
  //       }
  //     } else if (block.type === "heading_3") {
  //       const rich_text = block[block["type"]]["rich_text"];
  //       if (rich_text instanceof Array) {
  //         const text = rich_text
  //           .map((el) => (el.type === "text" ? el.text.content : ""))
  //           .join("");

  //         return { ...block, text };
  //       }
  //     } else if (block.type === "image") {
  //     } else if (block.type === "link_to_page") {
  //     } else if (block.type === "numbered_list_item") {
  //       const rich_text = block[block["type"]]["rich_text"];
  //       if (rich_text instanceof Array) {
  //         const text = rich_text
  //           .map((el) => (el.type === "text" ? el.text.content : ""))
  //           .join("");

  //         return { ...block, text };
  //       }
  //     } else if (block.type === "paragraph") {
  //       const rich_text = block[block["type"]]["rich_text"];
  //       if (rich_text instanceof Array) {
  //         const text = rich_text
  //           .map((el) => (el.type === "text" ? el.text.content : ""))
  //           .join("");

  //         return { ...block, text };
  //       }
  //     } else if (block.type === "pdf") {
  //     } else if (block.type === "quote") {
  //       const rich_text = block[block["type"]]["rich_text"];
  //       if (rich_text instanceof Array) {
  //         const text = rich_text
  //           .map((el) => (el.type === "text" ? el.text.content : ""))
  //           .join("");

  //         return { ...block, text };
  //       }
  //     } else if (block.type === "synced_block") {
  //     } else if (block.type === "table") {
  //     } else if (block.type === "table_of_contents") {
  //     } else if (block.type === "table_row") {
  //     } else if (block.type === "template") {
  //       const rich_text = block[block["type"]]["rich_text"];
  //       if (rich_text instanceof Array) {
  //         const text = rich_text
  //           .map((el) => (el.type === "text" ? el.text.content : ""))
  //           .join("");

  //         return { ...block, text };
  //       }
  //     } else if (block.type === "to_do") {
  //       const rich_text = block[block["type"]]["rich_text"];
  //       if (rich_text instanceof Array) {
  //         const text = rich_text
  //           .map((el) => (el.type === "text" ? el.text.content : ""))
  //           .join("");

  //         return { ...block, text };
  //       }
  //     } else if (block.type === "toggle") {
  //       const rich_text = block[block["type"]]["rich_text"];
  //       if (rich_text instanceof Array) {
  //         const text = rich_text
  //           .map((el) => (el.type === "text" ? el.text.content : ""))
  //           .join("");

  //         return { ...block, text };
  //       }
  //     } else if (block.type === "video") {
  //     }

  //     return block;
  //   });
  // }

  async clear(input: INotionService.ICrear): Promise<boolean> {
    try {
      const { pageId } = input;
      const notion = await this.createClient();

      let hasMore = true;
      let cursor: string | null = null;

      while (hasMore) {
        const response = await notion.blocks.children.list({
          block_id: pageId,
          ...(cursor && { start_cursor: cursor }),
        });

        await Promise.all(
          response.results.map(async (block) => {
            await retry(async () =>
              notion.blocks.delete({ block_id: block.id }),
            )();
          }),
        );

        cursor = response.next_cursor;
        hasMore = response.has_more;
      }

      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Notion Service.
   *
   * Update Notion Page Title
   */
  async updatePageTitle(
    input: INotionService.IUpdateNotionTitleInput,
  ): Promise<INotionService.ICreatePageOutput> {
    try {
      const notion = await this.createClient();
      const page = await notion.pages.update({
        page_id: input.pageId,
        properties: { title: { title: [{ text: { content: input.title } }] } },
      });

      const uuid = page.id.replaceAll("-", "");

      return {
        id: page.id,
        title: input.title,
        link: `https://www.notion.so/${uuid}`,
      };
    } catch (err) {
      throw err;
    }
  }

  /**
   * Notion Service.
   *
   * Create a gallery view database for notion.
   *
   * It is not possible to create a gallery view at once, and you must change the view to a gallery directly.
   * This endpoint must not be used to create each items.
   * This endpoint is only used to create a database.
   * Creating a database is different from adding items to a database.
   */
  async createGalleryDatabase(
    input: INotionService.ICreateGalleryDatabaseInput,
  ): Promise<INotionService.ICreateGalleryDatabaseOutput> {
    try {
      const headers = await this.getHeaders();
      const res = await axios.post(
        `https://api.notion.com/v1/databases`,
        {
          parent: {
            type: "page_id",
            page_id: input.parentPageId,
          },
          title: [
            {
              type: "text",
              text: {
                content: input.title,
              },
            },
          ],
          properties: {
            name: {
              title: {},
            },
            created_at: {
              date: {},
            },
          },
        },
        {
          headers: headers,
        },
      );

      return {
        id: res.data.id,
        title: res.data.title[0].plain_text ?? "제목 없음",
        url: res.data.url,
      };
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Notion Service.
   *
   * Create an item in the generated gallery view database.
   * Creating a database item means adding an item to an existing database.
   * If there is no database received from input, you must first create a database using the POST: /connector/notion/create-gallery-database endpoint and then run it.
   * You should use this endpoint when adding items to an already created database.
   * You need to use this endpoint to add multiple items to the gallery database at once.
   * If you need to add 3 items, instead of calling the endpoint 3 times, you should put the 3 items in an array in the info information and add the 3 items in 1 endpoint call.
   * Since the Notion database can only be created in table format, you will need to instruct users to manually change it to a gallery database view.
   */
  // async createGalleryDatabaseItem(
  //   input: INotionService.ICreateGalleryDatabaseItemInput,
  // ): Promise<INotionService.ICreateGalleryDatabaseItemOutput[]> {
  //   try {
  //     const result: INotionService.ICreateGalleryDatabaseItemOutput[] = [];
  //     await Promise.all(
  //       input.info.map(
  //         async (info: INotionService.ICreateGalleryDatabaseItemInfo) => {
  //           try {
  //             const headers = await this.getHeaders();

  //             const imageRegex = /!\[.*?\]\((https?:\/\/[^\s)]+)\)/g;
  //             const matches = [...info.markdown.matchAll(imageRegex)];
  //             const imageUrls = await Promise.all(
  //               matches.map(async (match) => {
  //                 const imageUrl = match.at(1);

  //                 if (!imageUrl) {
  //                   throw new Error("Image Url not Exists.");
  //                 }

  //                 const imageBuffer = await axios.get(imageUrl, {
  //                   responseType: "arraybuffer",
  //                 });
  //                 return await this.uploadImageToS3(imageBuffer.data);
  //               }),
  //             );

  //             const modifiedMarkdown = matches.reduce((acc, match, index) => {
  //               return acc.replace(match[0], `![Image](${imageUrls[index]})`);
  //             }, info.markdown);

  //             const blocks = markdownToBlocks(modifiedMarkdown);

  //             const database = await axios.get(
  //               `https://api.notion.com/v1/databases/${input.databaseId}`,
  //               {
  //                 headers: headers,
  //               },
  //             );

  //             const titlePropertyName: any = Object.keys(
  //               database.data.properties,
  //             ).find((key) => database.data.properties[key].type === "title");

  //             const item = await axios.post(
  //               `https://api.notion.com/v1/pages`,
  //               {
  //                 parent: {
  //                   type: "database_id",
  //                   database_id: input.databaseId,
  //                 },
  //                 properties: {
  //                   [titlePropertyName]: {
  //                     title: [
  //                       {
  //                         type: "text",
  //                         text: {
  //                           content: info.title,
  //                         },
  //                       },
  //                     ],
  //                   },
  //                 },
  //                 children: blocks,
  //               },
  //               {
  //                 headers: headers,
  //               },
  //             );
  //             result.push({
  //               pageId: item.data.id,
  //               url: item.data.url,
  //             });
  //           } catch (err) {
  //             console.error(
  //               `Error creating page for input titled "${info.title}":`,
  //               JSON.stringify(err),
  //             );
  //           }
  //         },
  //       ),
  //     );
  //     return result;
  //   } catch (err) {
  //     console.error(JSON.stringify(err));
  //     throw err;
  //   }
  // }

  // async uploadImageToS3(img: Buffer) {
  //   try {
  //     const imgUrl = await AwsProvider.uploadObject({
  //       key: `connector/notion/gallery-database-image/${v4()}.png`,
  //       data: img,
  //       contentType: "image/png",
  //     });

  //     return imgUrl;
  //   } catch (err) {
  //     console.error(JSON.stringify(err));
  //     throw err;
  //   }
  // }

  /**
   * Notion Service.
   *
   * Updates the contents of the page.
   *
   * This function updates the contents written on the page to the desired contents.
   *
   * The contents to be updated must be written in Markdown format.
   */
  async updatePageContent(
    input: INotionService.IUpdatePageContentInput,
  ): Promise<INotionService.IAppendPageByMarkdownOutput> {
    try {
      await this.clear({ pageId: input.pageId });
      return await this.appendBlocksByMarkdown({
        pageId: input.pageId,
        markdown: input.markdown,
      });
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Notion Service.
   *
   * Create a Notion Database
   *
   * Creating a database is different from adding items to a database.
   * Creating a database is a process of creating a database, and adding items to a database is a process of adding items to an existing database.
   * You need to understand what your users are asking for, how many properties they need, and which properties should be created.
   */
  async createDatabase(
    input: INotionService.ICreateDatabaseInput,
  ): Promise<INotionService.ICreateDatabaseOutput> {
    const { parentPageId, title, properties } = input;

    try {
      const headers = await this.getHeaders();
      const mergedProperties = properties.reduce(
        (acc, curr) => ({ ...acc, ...curr }),
        {},
      );
      const res = await axios.post(
        "https://api.notion.com/v1/databases",
        {
          parent: {
            type: "page_id",
            page_id: parentPageId,
          },
          title: [
            {
              type: "text",
              text: { content: title },
            },
          ],
          properties: {
            ...mergedProperties,
            created_at: {
              date: {},
            },
          },
        },
        {
          headers: headers,
        },
      );
      return {
        id: res.data.id,
        title: res.data.title[0].plain_text ?? "제목 없음",
        url: res.data.url,
      };
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Notion Service.
   *
   * Add property to notion database
   * If you want to add a property to an existing database, you should use this function.
   * For example, if there is an English word database in the Notion database, and there are three existing properties: word, meaning, and example sentence, and the user wants to add a property called Korean meaning, you should use this function to add a new property.
   * This function can only add one property at a time.
   */
  async addDatabaseProperty(
    input: INotionService.IAddDatabasePropertyInput,
  ): Promise<INotionService.IAddDatabasePropertyOutput> {
    try {
      const headers = await this.getHeaders();
      const res = await axios.patch(
        `https://api.notion.com/v1/databases/${input.databaseId}`,
        {
          properties: input.property,
        },
        {
          headers: headers,
        },
      );
      return {
        id: res.data.id,
        title: res.data.title[0].plain_text ?? "제목 없음",
        url: res.data.url,
      };
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Notion Service.
   *
   * Delete property to notion database
   * If you want to delete a property in an existing database, you should use this function.
   * For example, if there is an English word database in the Notion database, and there are 4 properties: word, meaning, example, and Korean meaning, and the user wants to delete the property called Korean meaning, you should use this function to delete the property.
   * You need to know the property name to delete it.
   * This function can only delete one property at a time.
   */
  async deleteDatabaseProperty(
    input: INotionService.IDeleteDatabasePropertyInput,
  ): Promise<INotionService.IDeleteDatabasePropertyOutput> {
    try {
      const headers = await this.getHeaders();
      const res = await axios.patch(
        `https://api.notion.com/v1/databases/${input.databaseId}`,
        {
          properties: {
            [input.propertyName]: null,
          },
        },
        {
          headers: headers,
        },
      );
      return {
        id: res.data.id,
        title: res.data.title[0].plain_text ?? "제목 없음",
        url: res.data.url,
      };
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * Notion Service.
   *
   * Adds an item to each row in the database
   * If you want to add items to an existing database, you should use this function.
   * You should analyze the user's requirements and assign appropriate values ​​to each property.
   * You should select the value you want to add and the property to which you want to add the value.
   * For example, if you have an English vocabulary database and the properties are word, example, and Korean meaning, and you create two items,
   * if the items to add are [{"apple", "Apple is a fruit", "사과"}, {"snack", "I like snack", "과자"}],
   * you should assign "apple" and "snack" to the word property,  "Apple is a fruit" and "I like snack" to the example, and "사과" and "과자" to the Korean meaning property.
   */
  async addItemsToDatabase(
    input: INotionService.IAddItemsToDatabaseInput,
  ): Promise<INotionService.IAddItemsToDatabaseOutput> {
    try {
      const headers = await this.getHeaders();
      const properties = await this.getDatabaseProperties(input.databaseId);

      let titlePropertyName: string = "";
      const richTextPropertyNames: string[] = [];
      let datePropertyName: string = "";

      for (const [propName, propValue] of Object.entries(properties)) {
        switch (propValue.type) {
          case "title":
            titlePropertyName = propName;
            break;
          case "rich_text":
            richTextPropertyNames.push(propName);
            break;
          case "date":
            if (!datePropertyName) {
              datePropertyName = propName;
            }
            break;
          default:
            break;
        }
      }

      const createItemPromises = input.items.map(async (item) => {
        try {
          const propertiesToSet: any = {};
          if (item.title) {
            propertiesToSet[titlePropertyName] = {
              title: [
                {
                  type: "text",
                  text: {
                    content: item.title,
                  },
                },
              ],
            };
          }

          if (item.rich_text && item.rich_text.length > 0) {
            item.rich_text.forEach((text, index) => {
              propertiesToSet[richTextPropertyNames[index]!] = {
                rich_text: [
                  {
                    type: "text",
                    text: {
                      content: text.value,
                    },
                  },
                ],
              };
            });
          }

          if (item.date) {
            propertiesToSet[datePropertyName] = {
              date: {
                start: item.date,
              },
            };
          }

          let blocks;

          if (item.markdown) {
            blocks = markdownToBlocks(item.markdown);
          }

          await axios.post(
            "https://api.notion.com/v1/pages",
            {
              parent: {
                database_id: input.databaseId,
              },
              properties: propertiesToSet,
              ...(blocks && { children: blocks }),
            },
            {
              headers: headers,
            },
          );
        } catch (err) {
          console.error(JSON.stringify(err));
          throw err;
        }
      });
      await Promise.all(createItemPromises);
      const database = await axios.get(
        `https://api.notion.com/v1/databases/${input.databaseId}`,
        {
          headers: headers,
        },
      );
      return {
        id: database.data.id,
        title: database.data.title[0].plain_text ?? "제목 없음",
        url: database.data.url,
      };
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  private async getDatabaseProperties(
    databaseId: string,
  ): Promise<INotionService.IDatabaseProperties> {
    try {
      const headers = await this.getHeaders();
      const res = await axios.get(
        `https://api.notion.com/v1/databases/${databaseId}`,
        {
          headers: headers,
        },
      );
      return res.data.properties;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  private async createClient() {
    return new Client({ auth: this.props.secret });
  }

  private async getHeaders() {
    return {
      "content-type": "application/json",
      Authorization: `Bearer ${this.props.secret}`,
      "Notion-Version": "2022-06-28",
      accept: "application/json",
    };
  }

  private removeChildren<T extends object | object[]>(target: T): T {
    if (target instanceof Array) {
      target.forEach((el) => this.removeChildren(el));
    } else {
      Object.entries(target).forEach(([key, value]) => {
        if (key === "children") {
          if ((value as any[]).length === 0) {
            delete (target as any)["children"];
          }

          this.removeChildren(value);
        } else {
          if (typeof value === "object" && value !== null) {
            this.removeChildren(value);
          }
        }
      });
    }

    return target;
  }
}
