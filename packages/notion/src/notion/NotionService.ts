import axios from "axios";
import { BlockObjectRequest } from "@notionhq/client/build/src/api-endpoints";
import { markdownToBlocks } from "@tryfabric/martian";
import { Block } from "@tryfabric/martian/build/src/notion/blocks";
import { NotionToMarkdown } from "notion-to-md";
import typia from "typia";
import { INotionService } from "../structures/INotionService";
import { Client } from "@notionhq/client";
import { retry } from "@wrtnlabs/connector-shared";

export class NotionService {
  constructor(private readonly props: INotionService.IProps) {}

  async deleteBlock(input: INotionService.IDeleteBlockInput): Promise<void> {
    const { block_id } = input;
    const headers = await this.getHeaders();
    const url = `https://api.notion.com/v1/blocks/${block_id}`;
    await axios.delete(url, { headers: headers });
  }

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
  formattingDatabaseProperties(
    input: INotionService.ICreateDatabaseItemInput & {
      propertiesInfo: Record<string, INotionService.DatabaseProperty>;
    },
  ): INotionService.IDatabasePropertyInput {
    const { propertiesInfo } = input;
    const properties: INotionService.IDatabasePropertyInput = {};

    for (const [, property] of Object.entries(propertiesInfo)) {
      const key = property.name;

      // 데이터베이스 아이템 업데이트 시 업데이트 하지 않는 프로퍼티가 있을 수 있음
      if (input[key] === undefined) continue;

      switch (property.type) {
        case "multi_select": {
          properties[key] = {
            multi_select: input[key].map((item: string) => ({ name: item })),
          };
          break;
        }
        case "select": {
          properties[key] = { select: { name: input[key] } };
          break;
        }
        case "title": {
          properties[key] = { title: [{ text: { content: input[key] } }] };
          break;
        }
        case "rich_text": {
          properties[key] = { rich_text: [{ text: { content: input[key] } }] };
          break;
        }
        case "number":
        case "email":
        case "url":
        case "phone_number":
        case "checkbox": {
          properties[key] = { [property.type]: input[key] };
          break;
        }
        // start는 필수, end는 optional(null 가능)
        case "date": {
          properties[key] = {
            date: { start: input[key].start, end: input[key].end },
          };
          break;
        }
        // getUsers() 함수로 부터 받아온 워크스페이스에 속한 사람들 id
        case "people": {
          properties[key] = {
            people: input[key].map((item: string) => ({ id: item })),
          };
          break;
        }
      }
    }
    return properties;
  }

  async createClient() {
    return new Client({ auth: this.props.secret });
  }

  async getHeaders() {
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

  private blocksToMarkdown<T extends Block & { id: string }>(
    blocks: T[],
  ): INotionService.AccurateMarkdownBlock[] {
    return blocks.map((block: T) => {
      if (block.type === "audio") {
      } else if (block.type === "bookmark") {
      } else if (block.type === "breadcrumb") {
      } else if (block.type === "bulleted_list_item") {
        const rich_text = block[block["type"]]["rich_text"];
        if (rich_text instanceof Array) {
          const text = rich_text
            .map((el) => (el.type === "text" ? el.text.content : ""))
            .join("");

          return { ...block, text };
        }
      } else if (block.type === "callout") {
        const rich_text = block[block["type"]]["rich_text"];
        if (rich_text instanceof Array) {
          const text = rich_text
            .map((el) => (el.type === "text" ? el.text.content : ""))
            .join("");

          return { ...block, text };
        }
      } else if (block.type === "code") {
        const rich_text = block[block["type"]]["rich_text"];
        if (rich_text instanceof Array) {
          const text = rich_text
            .map((el) => (el.type === "text" ? el.text.content : ""))
            .join("");

          return { ...block, text };
        }
      } else if (block.type === "column") {
      } else if (block.type === "column_list") {
      } else if (block.type === "divider") {
      } else if (block.type === "embed") {
      } else if (block.type === "equation") {
      } else if (block.type === "file") {
      } else if (block.type === "heading_1") {
        const rich_text = block[block["type"]]["rich_text"];
        if (rich_text instanceof Array) {
          const text = rich_text
            .map((el) => (el.type === "text" ? el.text.content : ""))
            .join("");

          return { ...block, text };
        }
      } else if (block.type === "heading_2") {
        const rich_text = block[block["type"]]["rich_text"];
        if (rich_text instanceof Array) {
          const text = rich_text
            .map((el) => (el.type === "text" ? el.text.content : ""))
            .join("");

          return { ...block, text };
        }
      } else if (block.type === "heading_3") {
        const rich_text = block[block["type"]]["rich_text"];
        if (rich_text instanceof Array) {
          const text = rich_text
            .map((el) => (el.type === "text" ? el.text.content : ""))
            .join("");

          return { ...block, text };
        }
      } else if (block.type === "image") {
      } else if (block.type === "link_to_page") {
      } else if (block.type === "numbered_list_item") {
        const rich_text = block[block["type"]]["rich_text"];
        if (rich_text instanceof Array) {
          const text = rich_text
            .map((el) => (el.type === "text" ? el.text.content : ""))
            .join("");

          return { ...block, text };
        }
      } else if (block.type === "paragraph") {
        const rich_text = block[block["type"]]["rich_text"];
        if (rich_text instanceof Array) {
          const text = rich_text
            .map((el) => (el.type === "text" ? el.text.content : ""))
            .join("");

          return { ...block, text };
        }
      } else if (block.type === "pdf") {
      } else if (block.type === "quote") {
        const rich_text = block[block["type"]]["rich_text"];
        if (rich_text instanceof Array) {
          const text = rich_text
            .map((el) => (el.type === "text" ? el.text.content : ""))
            .join("");

          return { ...block, text };
        }
      } else if (block.type === "synced_block") {
      } else if (block.type === "table") {
      } else if (block.type === "table_of_contents") {
      } else if (block.type === "table_row") {
      } else if (block.type === "template") {
        const rich_text = block[block["type"]]["rich_text"];
        if (rich_text instanceof Array) {
          const text = rich_text
            .map((el) => (el.type === "text" ? el.text.content : ""))
            .join("");

          return { ...block, text };
        }
      } else if (block.type === "to_do") {
        const rich_text = block[block["type"]]["rich_text"];
        if (rich_text instanceof Array) {
          const text = rich_text
            .map((el) => (el.type === "text" ? el.text.content : ""))
            .join("");

          return { ...block, text };
        }
      } else if (block.type === "toggle") {
        const rich_text = block[block["type"]]["rich_text"];
        if (rich_text instanceof Array) {
          const text = rich_text
            .map((el) => (el.type === "text" ? el.text.content : ""))
            .join("");

          return { ...block, text };
        }
      } else if (block.type === "video") {
      }

      return block;
    });
  }

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

  //  async  createGalleryDatabaseItem(
  //   input: INotionService.ICreateGalleryDatabaseItemInput,
  // ): Promise<INotionService.ICreateGalleryDatabaseItemOutput[]> {
  //   try {
  //     const result: INotionService.ICreateGalleryDatabaseItemOutput[] = [];
  //     await Promise.all(
  //       input.info.map(async (info: INotionService.ICreateGalleryDatabaseItemInfo) => {
  //         try {
  //           const headers = await this.getHeaders();

  //           const imageRegex = /!\[.*?\]\((https?:\/\/[^\s)]+)\)/g;
  //           const matches = [...info.markdown.matchAll(imageRegex)];
  //           const imageUrls = await Promise.all(
  //             matches.map(async (match) => {
  //               const imageUrl = match.at(1);

  //               if (!imageUrl) {
  //                 throw new Error("Image Url not Exists.")
  //               }

  //               const imageBuffer = await axios.get(imageUrl, {
  //                 responseType: "arraybuffer",
  //               });
  //               return await this.uploadImageToS3(imageBuffer.data);
  //             }),
  //           );

  //           const modifiedMarkdown = matches.reduce((acc, match, index) => {
  //             return acc.replace(match[0], `![Image](${imageUrls[index]})`);
  //           }, info.markdown);

  //           const blocks = markdownToBlocks(modifiedMarkdown);

  //           const database = await axios.get(
  //             `https://api.notion.com/v1/databases/${input.databaseId}`,
  //             {
  //               headers: headers,
  //             },
  //           );

  //           const titlePropertyName: any = Object.keys(
  //             database.data.properties,
  //           ).find((key) => database.data.properties[key].type === "title");

  //           const item = await axios.post(
  //             `https://api.notion.com/v1/pages`,
  //             {
  //               parent: {
  //                 type: "database_id",
  //                 database_id: input.databaseId,
  //               },
  //               properties: {
  //                 [titlePropertyName]: {
  //                   title: [
  //                     {
  //                       type: "text",
  //                       text: {
  //                         content: info.title,
  //                       },
  //                     },
  //                   ],
  //                 },
  //               },
  //               children: blocks,
  //             },
  //             {
  //               headers: headers,
  //             },
  //           );
  //           result.push({
  //             pageId: item.data.id,
  //             url: item.data.url,
  //           });
  //         } catch (err) {
  //           console.error(
  //             `Error creating page for input titled "${info.title}":`,
  //             JSON.stringify(err),
  //           );
  //         }
  //       }),
  //     );
  //     return result;
  //   } catch (err) {
  //     console.error(JSON.stringify(err));
  //     throw err;
  //   }
  // }

  // async  uploadImageToS3(img: Buffer) {
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

  async getDatabaseProperties(
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
}
