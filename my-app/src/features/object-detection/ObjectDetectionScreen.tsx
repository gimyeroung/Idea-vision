// 담당: ML Kit — object-detection 기능의 조립 화면.
// 1) 카메라로 사진을 찍는다 2) ML Kit으로 대분류 감지를 돌린다 3) 사각형을 사진 위에 그린다.
// 사각형을 탭했을 때 다음 단계(vision-analysis)로 넘기는 부분은 아직 연결하지 않았다.

import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';

import { BoundingBoxOverlay } from './BoundingBoxOverlay';
import { CameraView } from './CameraView';
import { useObjectDetection } from './useObjectDetection';

type CapturedPhoto = {
  uri: string;
  width: number;
  height: number;
};

export function ObjectDetectionScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const [photo, setPhoto] = useState<CapturedPhoto | null>(null);
  const { detectedObjects, isDetecting, error, detect, reset } = useObjectDetection();

  useEffect(() => {
    if (photo) {
      detect(photo.uri);
    }
  }, [photo, detect]);

  const handleRetake = () => {
    setPhoto(null);
    reset();
  };

  if (!photo) {
    return <CameraView onCapture={setPhoto} />;
  }

  const displayWidth = screenWidth;
  const displayHeight = displayWidth * (photo.height / photo.width);

  return (
    <View style={styles.container}>
      <View style={{ width: displayWidth, height: displayHeight }}>
        <Image source={{ uri: photo.uri }} style={StyleSheet.absoluteFill} contentFit="cover" />
        <BoundingBoxOverlay
          objects={detectedObjects}
          imageWidth={photo.width}
          imageHeight={photo.height}
          displayWidth={displayWidth}
          displayHeight={displayHeight}
        />
        {isDetecting && (
          <View style={[StyleSheet.absoluteFill, styles.loadingOverlay]}>
            <ActivityIndicator color="#ffffff" />
          </View>
        )}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <Pressable style={styles.retakeButton} onPress={handleRetake}>
        <Text style={styles.retakeButtonText}>다시 찍기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  error: {
    color: '#d32f2f',
    marginTop: 12,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  retakeButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#000000',
  },
  retakeButtonText: {
    color: '#ffffff',
  },
});
