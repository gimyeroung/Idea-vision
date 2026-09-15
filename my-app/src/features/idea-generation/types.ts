// 담당: LLM — 이 폴더에서만 쓰는 내부 타입 (다른 팀원과 공유할 타입은 src/shared/types/pipeline.ts 에 정의)

import { Idea, VisionAnalysisResult } from '../../shared/types/pipeline';

// LLM API 요청 Payload
export interface IdeaGenerateRequest {
  analysis: VisionAnalysisResult;
}

// LLM API 응답 Payload
export interface IdeaGenerateResponse {
  ideas: Idea[];
}

// custom hook 상태 타입
export interface UseIdeaGenerationState {
  ideas: Idea[];
  isLoading: boolean;
  error: string | null;
}