// 담당: ML Kit — 감지된 물체 위에 사각형(바운딩 박스)을 그리고, 탭하면 onPressObject로 알려준다.
// 원본 사진 픽셀 좌표(DetectedRect.box)를 화면에 실제로 표시되는 크기(displayWidth/Height)에 맞게 비율 변환해서 그린다.

import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { DetectedRect } from './types';

type Props = {
  objects: DetectedRect[];
  imageWidth: number;
  imageHeight: number;
  displayWidth: number;
  displayHeight: number;
  onPressObject?: (object: DetectedRect) => void;
};

export function BoundingBoxOverlay({
  objects,
  imageWidth,
  imageHeight,
  displayWidth,
  displayHeight,
  onPressObject,
}: Props) {
  const scaleX = displayWidth / imageWidth;
  const scaleY = displayHeight / imageHeight;

  return (
    <View style={[styles.overlay, { width: displayWidth, height: displayHeight }]} pointerEvents="box-none">
      {objects.map((object) => (
        <Pressable
          key={object.id}
          onPress={() => onPressObject?.(object)}
          style={[
            styles.box,
            {
              left: object.box.x * scaleX,
              top: object.box.y * scaleY,
              width: object.box.width * scaleX,
              height: object.box.height * scaleY,
            },
          ]}>
          <Text style={styles.label}>{object.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  box: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#00E676',
  },
  label: {
    position: 'absolute',
    top: -20,
    left: -2,
    backgroundColor: '#00E676',
    color: '#000000',
    fontSize: 12,
    paddingHorizontal: 4,
  },
});
