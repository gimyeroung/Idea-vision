// 담당: ML Kit — object-detection 기능의 조립 화면.
// 카메라를 계속 켜두고, 짧은 간격으로 자동 촬영→ML Kit 대분류 감지를 반복해서
// "실시간처럼" 보이는 사각형 오버레이를 만든다. (완전한 프레임 단위 실시간은 아님 —
// react-native-vision-camera의 프레임 프로세서를 쓰면 가능하지만 네이티브 모듈이 추가로 필요함)
// 사각형을 탭했을 때 다음 단계(vision-analysis)로 넘기는 부분은 아직 연결하지 않았다.

import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';

import { BoundingBoxOverlay } from './BoundingBoxOverlay';
import { CameraView, type CameraViewHandle } from './CameraView';
import { useObjectDetection } from './useObjectDetection';

// 감지 하나가 끝난 뒤 다음 촬영까지 쉬는 시간. 너무 짧으면 카메라/ML Kit이 못 따라가고,
// 너무 길면 실시간 느낌이 안 난다.
const CAPTURE_INTERVAL_MS = 1200;

export function ObjectDetectionScreen() {
  const cameraRef = useRef<CameraViewHandle>(null);
  const { detectedObjects, error, detect } = useObjectDetection();
  const [lastPhotoSize, setLastPhotoSize] = useState<{ width: number; height: number } | null>(null);
  const [previewSize, setPreviewSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    let cancelled = false;

    async function loop() {
      while (!cancelled) {
        const photo = await cameraRef.current?.capture();
        if (cancelled) return;
        if (photo) {
          setLastPhotoSize({ width: photo.width, height: photo.height });
          await detect(photo.uri);
        }
        await new Promise((resolve) => setTimeout(resolve, CAPTURE_INTERVAL_MS));
      }
    }

    loop();

    return () => {
      cancelled = true;
    };
  }, [detect]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setPreviewSize({ width, height });
  };

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <CameraView ref={cameraRef}>
        {lastPhotoSize && previewSize.width > 0 && previewSize.height > 0 && (
          <BoundingBoxOverlay
            objects={detectedObjects}
            imageWidth={lastPhotoSize.width}
            imageHeight={lastPhotoSize.height}
            displayWidth={previewSize.width}
            displayHeight={previewSize.height}
            // 사진이 세로/가로 중 어느 쪽으로 찍혔는지가 화면 방향과 다르면, 기기가 사진의
            // width/height를 실제 보이는 방향과 다르게 보고하고 있다는 뜻이라 회전 보정을 켠다.
            rotate90={
              lastPhotoSize.width > lastPhotoSize.height !== previewSize.width > previewSize.height
            }
          />
        )}
      </CameraView>
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  errorBanner: {
    position: 'absolute',
    bottom: 32,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
    padding: 12,
  },
  errorText: {
    color: '#ffffff',
    textAlign: 'center',
  },
});
