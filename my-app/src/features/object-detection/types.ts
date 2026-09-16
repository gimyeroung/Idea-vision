// 담당: ML Kit — 이 폴더 전용 타입 (다른 팀원과 공유할 타입은 src/shared/types/pipeline.ts 에 정의)

// 감지된 물체 하나를 화면에 그리기 쉬운 형태로 정리한 타입.
// ML Kit의 원래 결과(RNMLKitObjectDetectionObject)를 이 모양으로 변환해서 쓴다.
export interface DetectedRect {
  id: string;
  /** ML Kit 기본 모델이 주는 대분류 라벨 (예: Fashion good, Food, Home good, Place, Plant, Unknown) */
  label: string;
  confidence: number;
  /** 촬영한 원본 사진 기준 픽셀 좌표 */
  box: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
