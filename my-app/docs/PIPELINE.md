# 파이프라인 구조 & 역할 분담

## 흐름

1. **object-detection (ML Kit)** — 카메라 프레임에서 물체를 감지해 사각형(바운딩 박스)으로 표시.
2. 사용자가 사각형 하나를 탭.
3. **vision-analysis (Gemini Vision)** — 탭된 객체 이미지를 상세 분석.
4. **idea-generation (LLM)** — 분석 결과를 바탕으로 아이디어 생성 및 표시.

```
[카메라 프레임]
      │  ML Kit
      ▼
 DetectedObject  ──(탭)──▶  vision-analysis
      │  Gemini Vision
      ▼
 VisionAnalysisResult  ────▶  idea-generation
      │  LLM
      ▼
    Idea[]
```

## 폴더 구조

```
src/
├── app/                              화면 라우팅
│   ├── index.tsx                     메인 화면 (카메라 + 세 기능 조립 지점)
│   └── _layout.tsx                   루트 레이아웃 (헤더/화면 전환 설정)
├── features/                         3명이 각자 맡은 폴더 안에서만 작업 (서로 파일 안 겹침)
│   ├── object-detection/             담당: ML Kit (✅ 대분류 + 사각형 표시까지 구현됨)
│   │   ├── CameraView.tsx            카메라 미리보기 + 촬영 버튼, 권한 요청 처리
│   │   ├── BoundingBoxOverlay.tsx    감지된 물체 위에 사각형 그리기 + 탭했을 때 이벤트 전달
│   │   ├── ObjectDetectionScreen.tsx 위 컴포넌트/훅을 조립하는 화면 (index.tsx가 이걸 렌더링)
│   │   ├── ObjectDetectionProvider.tsx  ML Kit 모델을 앱 전체에 제공 (_layout.tsx에서 사용)
│   │   ├── useObjectDetection.ts     사진 → ML Kit 감지 결과를 돌려주는 훅
│   │   ├── mlkit.ts                  ML Kit 모델 설정 (기본 대분류 모델)
│   │   ├── types.ts                  이 폴더 안에서만 쓰는 타입
│   │   └── README.md                 역할 설명 + 실행 방법(Expo Go 불가, dev build 필요) + 다음 단계로 넘기는 값 정리
│   ├── vision-analysis/              담당: Gemini Vision
│   │   ├── AnalysisPanel.tsx         상세 분석 결과를 보여주는 화면
│   │   ├── useVisionAnalysis.ts      분석 요청 보내고 로딩/결과 상태 관리하는 훅
│   │   ├── geminiVisionClient.ts     Gemini Vision API 실제로 호출하는 코드
│   │   ├── types.ts                  이 폴더 안에서만 쓰는 타입
│   │   └── README.md                 역할 설명 + 입력/출력 값 정리
│   └── idea-generation/              담당: LLM
│       ├── IdeaList.tsx              LLM이 만든 아이디어 목록을 보여주는 화면
│       ├── useIdeaGeneration.ts      아이디어 생성 요청 보내고 로딩/결과 상태 관리하는 훅
│       ├── llmClient.ts              LLM API 실제로 호출하는 코드
│       ├── types.ts                  이 폴더 안에서만 쓰는 타입
│       └── README.md                 역할 설명 + 입력 값 정리 (마지막 단계라 출력 없음)
├── shared/
│   └── types/pipeline.ts             ★ 세 사람이 주고받는 데이터 모양을 정의하는 공용 파일
│                                        (DetectedObject → VisionAnalysisResult → Idea)
│                                        여기 고칠 땐 셋이 미리 얘기하고 같이 수정할 것
├── store/
│   └── usePipelineStore.ts           감지 결과 → 분석 결과 → 아이디어를 하나로 이어주는 전역 상태
└── config/
    └── env.ts                        Gemini Vision / LLM API 키, 주소 같은 환경설정 모아두는 곳
```

각 `features/*` 폴더의 `README.md`에 담당자의 역할과 입출력 계약이 정리되어 있다.

## 협업 규칙

- 각자 자신의 `features/<담당 폴더>` 안에서만 작업하고, 다른 사람 폴더는 건드리지 않는다.
- 단계 사이에서 주고받는 데이터 모양(타입)은 `src/shared/types/pipeline.ts`에 셋이 합의해서 정의한다. 이 파일을 고칠 때는 미리 이야기하고 변경한다.
- 화면에 세 기능을 붙이는 조립 코드(`src/app/index.tsx`)는 별도로 담당자를 정하거나 함께 작업한다.
