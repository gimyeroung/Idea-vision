import { Stack } from "expo-router";

import { ObjectDetectionProvider } from "@/features/object-detection/ObjectDetectionProvider";

export default function RootLayout() {
  return (
    <ObjectDetectionProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#ffffff" },
        }}
      />
    </ObjectDetectionProvider>
  );
}
