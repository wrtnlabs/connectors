import { MarpService } from "@wrtnlabs/connector-marp";
import typia from "typia";
import { TestGlobal } from "../TestGlobal";
import { randomUUID } from "crypto";

export const test_marp = async () => {
  const marpService = new MarpService({
    aws: {
      s3: {
        accessKeyId: TestGlobal.env.AWS_ACCESS_KEY_ID,
        bucket: TestGlobal.env.AWS_S3_BUCKET,
        region: "ap-northeast-2",
        secretAccessKey: TestGlobal.env.AWS_SECRET_ACCESS_KEY,
      },
    },
  });

  const res = await marpService.convertToPpt({
    markdown: `---
marp: true
title: Sample Presentation
description: A simple marp presentation example
theme: gaia
paginate: true
backgroundColor: #f0f0f0
class: lead
---
# 첫 번째 슬라이드
이것은 예제 Marp 슬라이드입니다.
---
## 두 번째 슬라이드
- 이 점은 중요합니다.
- 이것도 기억하세요.
---
### 세 번째 슬라이드
> 인용문을 여기에 넣습니다.
`,
    s3: {
      key: `connector/marp/${randomUUID()}.html`,
    },
  });

  typia.assert(res);
};

// 실패 케이스에 대한 테스트 코드 추가
export const test_marp_failed_case = async () => {
  const marpService = new MarpService({
    aws: {
      s3: {
        accessKeyId: TestGlobal.env.AWS_ACCESS_KEY_ID,
        bucket: TestGlobal.env.AWS_S3_BUCKET,
        region: "ap-northeast-2",
        secretAccessKey: TestGlobal.env.AWS_SECRET_ACCESS_KEY,
      },
    },
  });

  const res = await marpService.convertToPpt({
    markdown: `---\nmarp: true\ntheme: default\npaginate: true\n---\n\n# 좋은 개발자가 되는 법\n\n---\n\n## 1. 개발자의 기본 소양\n- 컴퓨터 과학의 기초 이해\n- 프로그래밍 언어의 중요성\n\n---\n\n## 2. 문제 해결 능력\n- 문제를 분석하고 해결하는 방법\n- 알고리즘과 자료구조의 역할\n\n---\n\n## 3. 지속적인 학습\n- 새로운 기술과 도구에 대한 학습\n- 개인 프로젝트를 통한 학습 강화\n\n---\n\n## 4. 코드 품질\n- 클린 코드 작성법\n- 테스트 주도 개발(TDD)의 중요성\n\n---\n\n## 5. 협업 능력\n- 팀워크와 커뮤니케이션 스킬\n- 코드 리뷰와 피드백 수용\n\n---\n\n## 6. 도메인 지식\n- 산업별 요구사항 이해\n- 특정 분야의 전문성 개발\n\n---\n\n## 7. 도구 활용 능력\n- 개발 도구와 환경 설정의 최적화\n- 버전 관리 시스템(Git)의 활용\n\n---\n\n## 8. 실전 경험\n- 인턴십과 프로젝트 경험의 중요성\n- 오픈 소스 기여의 가치\n\n---\n\n## 9. 커리어 개발\n- 네트워킹의 중요성\n- 경력 목표 설정과 달성 전략\n\n---\n\n## 10. 윤리적 책임\n- 소프트웨어 개발자의 사회적 책임\n- 개인정보 보호와 윤리적 고려`,
    s3: {
      key: `connector/marp/${randomUUID()}.html`,
    },
  });

  typia.assert(res);
};
