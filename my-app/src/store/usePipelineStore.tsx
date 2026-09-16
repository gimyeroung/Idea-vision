// 공용 — 감지된 객체 / 분석 결과 / 아이디어 목록 등 3단계 파이프라인의 전역 상태를 연결.
//
// object-detection이 사각형을 탭하면 setSelectedObject로 값을 채워 넣는다.
// vision-analysis는 usePipelineStore().selectedObject를 구독해서, 값이 채워지면
// Gemini Vision 분석을 시작하면 된다. (VisionAnalysisResult, Idea도 다 되면 여기에 같은 방식으로 추가)
// const { selectedObject } = usePipelineStore(); 이 한줄만쓰면 값이 바뀔때마다 새 값이 들어옴
import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';

import type { DetectedObject } from '@/shared/types/pipeline';

type PipelineContextValue = {
  selectedObject: DetectedObject | null;
  setSelectedObject: (object: DetectedObject | null) => void;
};

const PipelineContext = createContext<PipelineContextValue | null>(null);

export function PipelineProvider({ children }: PropsWithChildren) {
  const [selectedObject, setSelectedObject] = useState<DetectedObject | null>(null);

  const value = useMemo(() => ({ selectedObject, setSelectedObject }), [selectedObject]);

  return <PipelineContext.Provider value={value}>{children}</PipelineContext.Provider>;
}

export function usePipelineStore() {
  const context = useContext(PipelineContext);
  if (!context) {
    throw new Error('usePipelineStore는 PipelineProvider 안에서만 쓸 수 있습니다 (src/app/_layout.tsx 확인).');
  }
  return context;
}
