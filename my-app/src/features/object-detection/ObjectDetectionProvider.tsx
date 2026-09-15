// 담당: ML Kit — ML Kit 모델을 앱 전체에서 쓸 수 있게 해주는 Provider.
// src/app/_layout.tsx에서 최상위를 감싸는 용도로 사용한다.

import { useObjectDetectionModels, useObjectDetectionProvider } from '@infinitered/react-native-mlkit-object-detection';
import type { PropsWithChildren } from 'react';

import { DEFAULT_MODEL_OPTIONS, OBJECT_DETECTION_MODELS } from './mlkit';

export function ObjectDetectionProvider({ children }: PropsWithChildren) {
  const models = useObjectDetectionModels({
    assets: OBJECT_DETECTION_MODELS,
    loadDefaultModel: true,
    defaultModelOptions: DEFAULT_MODEL_OPTIONS,
  });

  const { ObjectDetectionProvider: Provider } = useObjectDetectionProvider(models);

  return <Provider>{children}</Provider>;
}
