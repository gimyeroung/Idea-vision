// 담당: ML Kit — 촬영한 사진(imageUri)을 ML Kit 기본 모델로 감지해서
// 화면에 그리기 좋은 형태(DetectedRect[])로 돌려주는 훅.

import { useObjectDetection as useMlkitObjectDetection } from '@infinitered/react-native-mlkit-object-detection';
import { useCallback, useState } from 'react';

import type { ObjectDetectionModels } from './mlkit';
import type { DetectedRect } from './types';

export function useObjectDetection() {
  const detector = useMlkitObjectDetection<ObjectDetectionModels>('default');

  const [detectedObjects, setDetectedObjects] = useState<DetectedRect[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detect = useCallback(
    async (imageUri: string) => {
      if (!detector) {
        setError('ML Kit 모델이 아직 로드되지 않았습니다.');
        return;
      }

      setIsDetecting(true);
      setError(null);

      try {
        const results = await detector.detectObjects(imageUri);

        setDetectedObjects(
          results
            .map((result, index) => ({
              id: result.trackingID != null ? String(result.trackingID) : `object-${index}`,
              label: result.labels[0]?.text ?? 'Unknown',
              confidence: result.labels[0]?.confidence ?? 0,
              box: {
                x: result.frame.origin.x,
                y: result.frame.origin.y,
                width: result.frame.size.x,
                height: result.frame.size.y,
              },
            }))
            // ML Kit이 물체는 찾았지만 5개 대분류 중 어디에도 확신 있게 못 넣었을 때 'Unknown'을
            // 준다. 대분류가 안 된 거라 화면에서는 보여주지 않는다.
            .filter((object) => object.label.toLowerCase() !== 'unknown')
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : '물체 감지 중 오류가 발생했습니다.');
      } finally {
        setIsDetecting(false);
      }
    },
    [detector]
  );

  const reset = useCallback(() => {
    setDetectedObjects([]);
    setError(null);
  }, []);

  return { detectedObjects, isDetecting, error, isModelReady: !!detector, detect, reset };
}
