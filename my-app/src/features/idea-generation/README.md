# idea-generation (담당: LLM)

## 역할

vision-analysis의 상세 분석 결과를 입력받아, LLM으로 해당 객체에 대한 아이디어(활용법, 응용 아이디어 등)를 생성해 보여준다. 파이프라인의 마지막 단계.

## 담당 파일

- `IdeaList.tsx` — 생성된 아이디어 목록 UI
- `useIdeaGeneration.ts` — 아이디어 생성 요청/로딩/결과 상태를 관리하는 훅
- `llmClient.ts` — LLM API 호출 클라이언트
- `types.ts` — 이 폴더 내부 전용 타입

## 입력 (vision-analysis로부터 받는 값)

`src/shared/types/pipeline.ts`의 `VisionAnalysisResult`.

## 출력

`src/shared/types/pipeline.ts`의 `Idea` 형태의 목록을 화면에 표시한다 (이후 단계로 넘기지 않는 최종 출력).

세부 필드는 팀원과 합의 후 `pipeline.ts`에 함께 정의한다.
