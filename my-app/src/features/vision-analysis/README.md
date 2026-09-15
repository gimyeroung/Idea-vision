# vision-analysis (담당: Gemini Vision)

## 역할

object-detection에서 사용자가 탭한 객체(이미지 + 대분류 라벨)를 입력받아, Gemini Vision으로 상세 분석(세부 종류, 특징, 설명 등)을 수행한다. 분석 결과를 idea-generation 단계로 넘긴다.

## 담당 파일

- `AnalysisPanel.tsx` — 분석 결과를 보여주는 UI
- `useVisionAnalysis.ts` — 분석 요청/로딩/결과 상태를 관리하는 훅
- `geminiVisionClient.ts` — Gemini Vision API 호출 클라이언트
- `types.ts` — 이 폴더 내부 전용 타입

## 입력 (object-detection으로부터 받는 값)

`src/shared/types/pipeline.ts`의 `DetectedObject`.

## 다음 단계로 넘기는 값 (출력 계약)

분석이 끝나면 `src/shared/types/pipeline.ts`의 `VisionAnalysisResult` 형태로 값을 넘긴다.
필드는 대략: 원본 객체 id, 상세 라벨/카테고리, 특징 설명 텍스트, 신뢰도 등.

세부 필드는 팀원과 합의 후 `pipeline.ts`에 함께 정의한다.
