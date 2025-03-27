#!/bin/bash

# 디렉토리 목록을 배열로 정의
directories=(
#  "google_ads"
#  "google_slides"
  "hancell"
#  "marp"
)

# 각 디렉토리를 순회
for dir in "${directories[@]}"; do
  echo "Processing directory: $dir"
  
  # 디렉토리로 이동하고 명령어 실행
  cd "../$dir" && pnpm run build && pnpm run test
  
  # 명령어 실행 후 상태 확인
  if [ $? -eq 0 ]; then
    echo "Successfully built and tested $dir"
  else
    echo "Error occurred in $dir"
    exit 1 # 에러가 발생하면 스크립트 종료
  fi
  
  # 원래 디렉토리로 돌아가기 (필요 시)
  cd - > /dev/null
done

echo "All directories processed!"
