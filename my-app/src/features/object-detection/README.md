# object-detection (담당: ML Kit)

## 역할

카메라로 사진을 찍고, ML Kit 기본 모델로 물체를 감지해 대분류(Fashion good / Food / Home good / Place / Plant / Unknown)와 사각형(바운딩 박스)을 화면에 표시한다. 사용자가 그중 하나를 탭하면 해당 객체 정보를 다음 단계(vision-analysis)로 넘긴다.

## 현재 구현 상태

- 카메라 촬영 → ML Kit 대분류 감지 → 사진 위에 사각형 표시까지 동작함
- 사각형을 탭했을 때 vision-analysis로 값을 넘기는 부분은 **아직 연결 안 됨** (`BoundingBoxOverlay`의 `onPressObject`는 있지만 `ObjectDetectionScreen`에서 아직 사용하지 않음)
- 커스텀 `.tflite` 모델 없이 ML Kit 기본 모델만 사용 — 더 세부적인 분류는 vision-analysis(Gemini Vision) 담당의 역할

## ⚠️ Expo Go에서 실행 불가

`@infinitered/react-native-mlkit-object-detection`은 네이티브 모듈이라 **Expo Go로는 실행이 안 된다.** 실행/테스트하려면:

```bash
npx expo prebuild
npx expo run:android   # 또는 npx expo run:ios (Mac 필요)
```

로 네이티브 프로젝트를 만들고 실제 기기/에뮬레이터에서 개발 빌드를 띄워야 한다. 웹(`npx expo start --web`)에서도 이 모듈은 동작하지 않는다.

## 담당 파일

- `CameraView.tsx` — 카메라 프리뷰 + 촬영 버튼, 권한 요청 처리
- `BoundingBoxOverlay.tsx` — 감지된 사각형 그리기 + 탭 처리
- `ObjectDetectionScreen.tsx` — 위 두 컴포넌트와 훅을 조립하는 화면 (src/app/index.tsx에서 이걸 렌더링함)
- `ObjectDetectionProvider.tsx` — ML Kit 모델을 앱 전체에 제공하는 Provider (src/app/_layout.tsx에서 사용)
- `useObjectDetection.ts` — 사진을 ML Kit에 넘기고 감지 결과를 받는 훅
- `mlkit.ts` — ML Kit 모델 설정(대분류 기본 모델만 사용)
- `types.ts` — 이 폴더 내부 전용 타입 (`DetectedRect`)

## 다음 단계로 넘기는 값 (출력 계약)

사각형을 탭했을 때, `src/shared/types/pipeline.ts`의 `DetectedObject` 형태로 값을 넘긴다.
필드는 대략: 객체 id, 대분류 라벨(label), 프레임 내 좌표(bbox), 탭 시점의 원본 이미지(또는 크롭된 이미지) 참조.

세부 필드는 팀원과 합의 후 `pipeline.ts`에 함께 정의한다.
