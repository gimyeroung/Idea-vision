# object-detection (담당: ML Kit)

## 역할

카메라 프레임에서 물체를 감지해 화면에 사각형(바운딩 박스)으로 표시한다. 사용자가 그중 하나를 탭하면 해당 객체 정보를 다음 단계(vision-analysis)로 넘긴다.

## 담당 파일

- `CameraView.tsx` — 카메라 프리뷰 렌더링
- `BoundingBoxOverlay.tsx` — 감지된 사각형 그리기 + 탭 처리
- `useObjectDetection.ts` — 프레임을 ML Kit에 넘기고 감지 결과를 받는 훅
- `mlkit.ts` — ML Kit 네이티브/라이브러리 호출 래퍼
- `types.ts` — 이 폴더 내부 전용 타입

## 다음 단계로 넘기는 값 (출력 계약)

사각형을 탭했을 때, `src/shared/types/pipeline.ts`의 `DetectedObject` 형태로 값을 넘긴다.
필드는 대략: 객체 id, 대분류 라벨(label), 프레임 내 좌표(bbox), 탭 시점의 원본 이미지(또는 크롭된 이미지) 참조.

세부 필드는 팀원과 합의 후 `pipeline.ts`에 함께 정의한다.
