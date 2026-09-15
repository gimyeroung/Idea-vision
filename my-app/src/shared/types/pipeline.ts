// 공용 — object-detection → vision-analysis → idea-generation 사이에서 주고받는 타입을
// 여기에 3명이 함께 정의한다 (DetectedObject, VisionAnalysisResult, Idea 등).

// vision-analysis 모듈에서 전달해주는 상세 분석 결과
export interface VisionAnalysisResult {
  objectId: string;
  label: string; // 예: "의자", "텀블러"
  description: string; // 객체 특징 및 분석 정보
}

// idea-generation 모듈에서 생성 및 표시할 아이디어 구조
export interface Idea {
  id: string;
  title: string;
  description: string;
  category?: string; // 예: "활용법", "재활용", "응용"
}