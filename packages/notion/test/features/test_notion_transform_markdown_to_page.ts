import { NotionService } from "@wrtnlabs/connector-notion/lib/notion/NotionService";
import { TestGlobal } from "../TestGlobal";
import { randomUUID } from "crypto";
import typia from "typia";

export const test_notion_transform_markdown_to_page = async () => {
  const notionService = new NotionService({
    notionApiKey: TestGlobal.env.NOTION_TEST_SECRET,
  });

  const res = await notionService.createPageByMarkdown({
    markdown: `## 삼성전자 추가 분석

### 최근 뉴스 및 시장 동향
1. **[Samsung Electronics Announces Results for Second Quarter of 2024](https://news.samsung.com/global/samsung-electronics-announces-results-for-second-quarter-of-2024)**
   - 삼성전자는 2024년 2분기 실적을 발표했습니다. 회사는 74.07조 원의 통합 매출을 기록했습니다.

2. **[Samsung Electronics Co., Ltd. (005930.KS) Stock Quote](https://finance.yahoo.com/quote/005930.KS/)**
   - 삼성전자 주식의 최신 정보, 주가, 뉴스 등을 제공합니다.
     - 삼성전자 주식의 최신 정보란?`,
    parentPageId: "011ff941f052423f8a203d8a84e4e71f",
    title: "TEST",
  });

  typia.assert(res);
};

export const test_api_connector_notion_transform_markdown_to_page_without_non_existant_parent_page_id =
  async () => {
    const notionService = new NotionService({
      notionApiKey: TestGlobal.env.NOTION_TEST_SECRET,
    });

    const res = await notionService.createPageByMarkdown({
      markdown: `## 삼성전자 추가 분석

### 최근 뉴스 및 시장 동향
1. **[Samsung Electronics Announces Results for Second Quarter of 2024](https://news.samsung.com/global/samsung-electronics-announces-results-for-second-quarter-of-2024)**
   - 삼성전자는 2024년 2분기 실적을 발표했습니다. 회사는 74.07조 원의 통합 매출을 기록했습니다.

2. **[Samsung Electronics Co., Ltd. (005930.KS) Stock Quote](https://finance.yahoo.com/quote/005930.KS/)**
   - 삼성전자 주식의 최신 정보, 주가, 뉴스 등을 제공합니다.
     - 삼성전자 주식의 최신 정보란?`,
      parentPageId: randomUUID(),
      title: "TEST",
    });

    typia.assert(res);
  };
