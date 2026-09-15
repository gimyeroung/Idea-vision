# vision-analysis (담당: Gemini Vision)

## 역할

object-detection에서 사용자가 탭한 객체(이미지 + 대분류 라벨)를 입력받아, Gemini Vision으로 상세 분석(세부 종류, 특징, 설명 등)을 수행한다. 분석 결과를 idea-generation 단계로 넘긴다.

## 담당 파일

- `AnalysisPanel.tsx` — 분석 결과를 보여주는 UI
- `useVisionAnalysis.ts` — 분석 요청/로딩/결과 상태를 관리하는 훅
- `geminiVisionClient.ts` — Gemini Vision API 호출 클라이언트
- `types.ts` — 이 폴더 내부 전용 타입

## 입력 (object-detection으로부터 받는 값)

`src/shared/types/pipeline.ts`의 `DetectedObject`. 필드: `id`, `label`(대분류), `confidence`, `imageUri`(탭 시점에 촬영된 원본 사진), `box`(원본 사진 픽셀 좌표 — 이 영역만 잘라서 Gemini Vision에 보내고 싶으면 이 값으로 크롭).

**받는 방법**: object-detection이 사각형을 탭하면 `src/store/usePipelineStore.tsx`의 `selectedObject`에 값을 채워 넣도록 이미 연결해뒀다. 이 화면에서는 이렇게 구독하면 된다:

```tsx
import { usePipelineStore } from '@/store/usePipelineStore';

const { selectedObject, setSelectedObject } = usePipelineStore();
// selectedObject가 null이 아니면 분석 시작하면 됨
// 분석 화면을 닫을 땐 setSelectedObject(null)
```

지금은 object-detection 화면(`ObjectDetectionScreen.tsx`)에 이 값이 잘 들어오는지 확인하는 임시 배너만 떠 있다. 이 자리에 실제 분석 화면(`AnalysisPanel.tsx` 등)을 넣는 건 이 폴더 담당의 몫이다.

## 다음 단계로 넘기는 값 (출력 계약)

분석이 끝나면 `src/shared/types/pipeline.ts`의 `VisionAnalysisResult` 형태로 값을 넘긴다.
필드는 대략: 원본 객체 id, 상세 라벨/카테고리, 특징 설명 텍스트, 신뢰도 등.

세부 필드는 팀원과 합의 후 `pipeline.ts`에 함께 정의한다.
