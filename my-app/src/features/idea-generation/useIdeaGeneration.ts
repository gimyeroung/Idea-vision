// 담당: LLM — 분석 결과를 받아 아이디어 생성을 요청하고 결과 상태를 관리하는 훅

import { useState, useCallback } from 'react';
import { VisionAnalysisResult, Idea } from '../../shared/types/pipeline';
import { fetchIdeasFromLLM } from './llmClient';

export const useIdeaGeneration = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateIdeas = useCallback(async (analysis: VisionAnalysisResult) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchIdeasFromLLM({ analysis });
      setIdeas(response.ideas);
    } catch (err) {
      setError(err instanceof Error ? err.message : '아이디어 생성 실패');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    ideas,
    isLoading,
    error,
    generateIdeas,
  };
};