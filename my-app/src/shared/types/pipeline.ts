// 공용 — object-detection → vision-analysis → idea-generation 사이에서 주고받는 타입을
// 여기에 3명이 함께 정의한다. 수정 전에 서로 얘기하고 바꿀 것.

// object-detection(ML Kit)이 사각형을 탭했을 때 vision-analysis(Gemini Vision)로 넘기는 값.
export interface DetectedObject {
  id: string;
  /** ML Kit 기본 모델이 준 대분류 라벨 (예: Fashion good, Food, Home good, Place, Plant) */
  label: string;
  confidence: number;
  /** 탭한 시점에 촬영된 원본 사진 (ML Kit이 감지에 사용한 사진과 동일한 파일) */
  imageUri: string;
  /** imageUri와 같은 사진의 base64 인코딩. Gemini Vision API에 바로 넘길 때 씀 */
  base64: string;
  /** 원본 사진 기준 픽셀 좌표. 이 영역만 잘라서 Gemini Vision에 보내고 싶으면 이 값으로 크롭하면 됨 */
  box: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// vision-analysis 분석 결과 모양은 src/features/vision-analysis/types.ts의 VisionAnalysisResult 참고.
// idea-generation 결과 모양은 src/features/idea-generation/types.ts의 Idea 참고.
