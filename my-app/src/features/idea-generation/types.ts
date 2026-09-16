export type Idea = {
    title: string;
    summary: string;
    whyItFits: string;
    steps: string[];
};

export type IdeaGenerationInput = {
    analysis: string;
};
// 담당: LLM — 이 폴더에서만 쓰는 내부 타입 (다른 팀원과 공유할 타입은 src/shared/types/pipeline.ts 에 정의)
