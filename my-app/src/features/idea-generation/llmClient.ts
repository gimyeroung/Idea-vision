// 담당: LLM — LLM API 호출 클라이언트

import { IdeaGenerateRequest, IdeaGenerateResponse } from './types';

// TODO: 실제 사용 중인 LLM API Endpoint 또는 SDK로 변경
export const fetchIdeasFromLLM = async (
  payload: IdeaGenerateRequest
): Promise<IdeaGenerateResponse> => {
  const { label, description } = payload.analysis;

  // 실제 API 호출 로직 구현 위치 (예시: fetch 또는 openai SDK)
  // const response = await fetch('YOUR_LLM_API_URL', { ... });

  // 프론트 단독 테스트/개발용 Mock 응답
  await new Promise((resolve) => setTimeout(resolve, 1500)); // 로딩 흉내

  return {
    ideas: [
      {
        id: '1',
        title: `${label} 기반 커스텀 리사이클링`,
        description: `${description} 분석 결과를 바탕으로 한 인테리어 활용 아이디어입니다.`,
        category: '재활용',
      },
      {
        id: '2',
        title: `${label} 스마트 관리 앱 연동`,
        description: '센서를 부착하여 모바일 앱과 연동하는 스마트 아이디어입니다.',
        category: '응용',
      },
    ],
  };
};