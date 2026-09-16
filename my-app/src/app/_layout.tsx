import { Stack } from "expo-router";

import { ObjectDetectionProvider } from "@/features/object-detection/ObjectDetectionProvider";
import { PipelineProvider } from "@/store/usePipelineStore";

export default function RootLayout() {
  return (
    <PipelineProvider>
      <ObjectDetectionProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#ffffff" },
          }}
        />
      </ObjectDetectionProvider>
    </PipelineProvider>
  );
}
