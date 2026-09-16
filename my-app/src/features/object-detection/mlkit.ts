// 담당: ML Kit — ML Kit 모델 설정
//
// 커스텀 .tflite 모델 없이, ML Kit 기본 제공 모델(대분류 5종: Fashion good, Food,
// Home good, Place, Plant + Unknown)만 사용한다. 더 세부적인 분류는
// vision-analysis(Gemini Vision) 담당에서 처리한다.

import type { ObjectDetectionConfig, RNMLKitObjectDetectorOptions } from '@infinitered/react-native-mlkit-object-detection';

export const OBJECT_DETECTION_MODELS: ObjectDetectionConfig = {};

export type ObjectDetectionModels = typeof OBJECT_DETECTION_MODELS;

export const DEFAULT_MODEL_OPTIONS: RNMLKitObjectDetectorOptions = {
  shouldEnableMultipleObjects: true,
  shouldEnableClassification: true,
  detectorMode: 'singleImage',
};
