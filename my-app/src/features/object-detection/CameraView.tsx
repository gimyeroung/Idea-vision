// 담당: ML Kit — 카메라 미리보기. 계속 켜져있고, 상위(ObjectDetectionScreen)가 ref로
// capture()를 호출해서 주기적으로 프레임을 가져간다. children은 미리보기 위에 겹쳐서 그려진다
// (사각형 오버레이용).

import { CameraView as ExpoCameraView, useCameraPermissions } from 'expo-camera';
import { forwardRef, useImperativeHandle, useRef, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export type CapturedPhoto = {
  uri: string;
  width: number;
  height: number;
};

export type CameraViewHandle = {
  capture: () => Promise<CapturedPhoto | undefined>;
};

type Props = {
  children?: ReactNode;
};

export const CameraView = forwardRef<CameraViewHandle, Props>(function CameraView({ children }, ref) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<ExpoCameraView>(null);

  useImperativeHandle(ref, () => ({
    capture: async () => {
      const photo = await cameraRef.current?.takePictureAsync({ quality: 0.5 });
      if (!photo) return undefined;
      return { uri: photo.uri, width: photo.width, height: photo.height };
    },
  }));

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>물체를 감지하려면 카메라 권한이 필요합니다.</Text>
        <Pressable style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>권한 허용하기</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ExpoCameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing="back"
        animateShutter={false}
      />
      {children}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  message: {
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#000000',
  },
  buttonText: {
    color: '#ffffff',
  },
});
