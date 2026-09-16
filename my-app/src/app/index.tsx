import { useEffect } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { IdeaList } from "@/features/idea-generation/IdeaList";
import { useIdeaGeneration } from "@/features/idea-generation/useIdeaGeneration";
import { ObjectDetectionScreen } from "@/features/object-detection/ObjectDetectionScreen";
import { AnalysisPanel } from "@/features/vision-analysis/AnalysisPanel";
import { useVisionAnalysis } from "@/features/vision-analysis/useVisionAnalysis";
import { usePipelineStore } from "@/store/usePipelineStore";

export default function Index() {
  const { selectedObject, setSelectedObject } = usePipelineStore();
  const { result, isLoading, error, analyze } = useVisionAnalysis();
  const {
    ideas,
    isLoading: isGeneratingIdeas,
    error: ideaError,
    generate,
  } = useIdeaGeneration();

  useEffect(() => {
    if (!selectedObject) return;

    let cancelled = false;

    analyze({ base64: selectedObject.base64, mimeType: "image/jpeg" }).then((analysisResult) => {
      if (!cancelled && analysisResult) {
        generate(analysisResult.text);
      }
    });

    return () => {
      cancelled = true;
    };
    // selectedObject가 바뀔 때만 새로 분석을 시작하면 된다 (analyze/generate는 안정적인 참조가 아님)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedObject]);

  return (
    <View style={styles.container}>
      <ObjectDetectionScreen />

      {selectedObject && (
        <View style={styles.resultsSheet}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>{selectedObject.label}</Text>
            <Pressable onPress={() => setSelectedObject(null)}>
              <Text style={styles.closeButton}>닫기</Text>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.resultsContent}>
            <AnalysisPanel result={result} isLoading={isLoading} error={error} />
            <IdeaList ideas={ideas} isLoading={isGeneratingIdeas} error={ideaError} />
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  resultsSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: "60%",
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#173b3a",
  },
  closeButton: {
    color: "#587271",
    fontWeight: "600",
  },
  resultsContent: {
    padding: 16,
    paddingTop: 4,
    gap: 16,
  },
});
