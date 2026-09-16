// 공용 — object-detection → vision-analysis → idea-generation 사이에서 주고받는 타입을
<<<<<<< HEAD
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
=======
// 여기에 3명이 함께 정의한다. 수정 전에 서로 얘기하고 바꿀 것.

// object-detection(ML Kit)이 사각형을 탭했을 때 vision-analysis(Gemini Vision)로 넘기는 값.
export interface DetectedObject {
  id: string;
  /** ML Kit 기본 모델이 준 대분류 라벨 (예: Fashion good, Food, Home good, Place, Plant) */
  label: string;
  confidence: number;
  /** 탭한 시점에 촬영된 원본 사진 (ML Kit이 감지에 사용한 사진과 동일한 파일) */
  imageUri: string;
  /** 원본 사진 기준 픽셀 좌표. 이 영역만 잘라서 Gemini Vision에 보내고 싶으면 이 값으로 크롭하면 됨 */
  box: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// TODO (vision-analysis 담당): Gemini Vision 분석이 끝난 뒤 idea-generation으로 넘길 값.
// export interface VisionAnalysisResult { ... }

// TODO (idea-generation 담당): LLM이 만든 아이디어 하나의 모양.
// export interface Idea { ... }
>>>>>>> fdd70f49db831ebf16fcec8d6a822f42abd4212a
