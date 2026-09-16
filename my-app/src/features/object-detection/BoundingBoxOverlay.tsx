// 담당: ML Kit — 감지된 물체 위에 사각형(바운딩 박스)을 그리고, 탭하면 onPressObject로 알려준다.
// 원본 사진 픽셀 좌표(DetectedRect.box)를, 카메라 미리보기가 화면을 "채우는"(cover) 방식과 똑같이
// 계산해서 위치를 맞춘다. 사진 비율과 화면 비율이 다르면 카메라 미리보기도 가장자리가 잘려서
// 보이기 때문에, 사각형도 똑같이 잘리는 걸 감안해서 계산해야 위치가 어긋나지 않는다.
//
// ⚠️ rotate90: 안드로이드 기종에 따라 촬영된 사진의 width/height가 실제 화면에 보이는 방향과
// 다르게(가로/세로 뒤바뀌어서) 나오는 경우가 있다 (expo-camera의 잘 알려진 이슈). 그런 기기에서는
// 이 값을 true로 넘겨서 좌표를 90도 회전 보정한다. 실기기 테스트 없이 넣은 최선의 추정이라,
// 실제로 켜봤을 때 사각형이 여전히 어긋나거나 반대 방향으로 돌아가 보이면 ROTATE_DIRECTION만
// 'ccw'로 바꿔보면 된다.

import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { DetectedRect } from './types';

// 90도 보정이 필요할 때 돌리는 방향. 화면이 여전히 이상하면 'ccw'로 바꿔서 테스트해볼 것.
const ROTATE_DIRECTION: 'cw' | 'ccw' = 'cw';

// 물체마다 다른 색을 쓰기 위한 팔레트. 같은 대분류 라벨은 항상 같은 색이 나오도록
// 라벨 문자열을 해시해서 고른다 (촬영할 때마다 감지 순서가 바뀌어도 색이 안 튐).
const COLOR_PALETTE = ['#00E676', '#FF5252', '#40C4FF', '#FFD740', '#E040FB', '#FF6E40', '#69F0AE', '#B388FF'];

function colorForLabel(label: string): string {
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = (hash * 31 + label.charCodeAt(i)) >>> 0;
  }
  return COLOR_PALETTE[hash % COLOR_PALETTE.length];
}

type Props = {
  objects: DetectedRect[];
  imageWidth: number;
  imageHeight: number;
  displayWidth: number;
  displayHeight: number;
  /** 사진의 width/height가 실제 보이는 방향과 뒤바뀌어 있는 기기일 때 true */
  rotate90?: boolean;
  onPressObject?: (object: DetectedRect) => void;
};

export function BoundingBoxOverlay({
  objects,
  imageWidth,
  imageHeight,
  displayWidth,
  displayHeight,
  rotate90 = false,
  onPressObject,
}: Props) {
  // rotate90이면 사진이 실제로는 90도 돌아간 채 저장된 것으로 보고, 박스 좌표 자체를 먼저
  // 회전시킨 다음, 회전된 이미지 크기(visualWidth/Height) 기준으로 화면에 맞춘다.
  const visualWidth = rotate90 ? imageHeight : imageWidth;
  const visualHeight = rotate90 ? imageWidth : imageHeight;

  const scale = Math.max(displayWidth / visualWidth, displayHeight / visualHeight);
  const offsetX = (visualWidth * scale - displayWidth) / 2;
  const offsetY = (visualHeight * scale - displayHeight) / 2;

  const boxes = objects
    .map((object) => {
      const { x, y, width, height } = object.box;

      const rotated = !rotate90
        ? { x, y, width, height }
        : ROTATE_DIRECTION === 'cw'
          ? { x: imageHeight - (y + height), y: x, width: height, height: width }
          : { x: y, y: imageWidth - (x + width), width: height, height: width };

      const left = rotated.x * scale - offsetX;
      const top = rotated.y * scale - offsetY;
      const right = left + rotated.width * scale;
      const bottom = top + rotated.height * scale;

      // 화면 경계 밖으로 나간 부분은 잘라낸다 (박스 전체를 버리진 않음 — 살짝만 걸쳐도
      // 통째로 사라지면 화면에 물체가 여러 개 있어도 하나도 안 남는 경우가 생긴다)
      return {
        object,
        left: Math.max(left, 0),
        top: Math.max(top, 0),
        width: Math.min(right, displayWidth) - Math.max(left, 0),
        height: Math.min(bottom, displayHeight) - Math.max(top, 0),
        color: colorForLabel(object.label),
      };
    })
    // 화면과 아예 안 겹치는(완전히 화면 밖으로 나간) 것만 숨긴다
    .filter(({ width, height }) => width > 0 && height > 0);

  return (
    <View style={[styles.overlay, { width: displayWidth, height: displayHeight }]} pointerEvents="box-none">
      {boxes.map(({ object, left, top, width, height, color }) => (
        <Pressable
          key={object.id}
          onPress={() => onPressObject?.(object)}
          style={[styles.box, { left, top, width, height, borderColor: color }]}>
          <Text style={[styles.label, { backgroundColor: color }]}>{object.label}</Text>
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
  },
  label: {
    position: 'absolute',
    top: -20,
    left: -2,
    color: '#000000',
    fontSize: 12,
    paddingHorizontal: 4,
  },
});
