import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { usePipelineStore } from "../../store/usePipelineStore";
import type { VisionAnalysisResult } from "./types";

type AnalysisPanelProps = {
    result: VisionAnalysisResult | null;
    isLoading: boolean;
    error: string | null;
};

export function AnalysisPanel({
    result,
    isLoading,
    error,
}: AnalysisPanelProps) {
    const { selectedObject } = usePipelineStore();

    if (!selectedObject) return null;

    return (
        <View style={styles.panel}>
            <Text style={styles.eyebrow}>GEMINI VISION</Text>
            <Text style={styles.title}>{selectedObject.label} 분석 결과</Text>
            {isLoading ? (
                <View style={styles.feedback}>
                    <ActivityIndicator color="#0c7c86" />
                    <Text style={styles.muted}>이미지를 분석하고 있습니다...</Text>
                </View>
            ) : error ? (
                <Text style={styles.error}>{error}</Text>
            ) : result ? (
                <Text style={styles.result}>{result.text}</Text>
            ) : (
                <Text style={styles.muted}>이미지를 선택하면 AI 분석 결과가 여기에 표시됩니다.</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    panel: {
        backgroundColor: "#f0f7f5",
        borderRadius: 16,
        padding: 18,
        borderWidth: 1,
        borderColor: "#cce5df",
    },
    eyebrow: {
        color: "#0c7c86",
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 1.2,
        marginBottom: 5,
    },
    title: {
        color: "#163b3c",
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 12,
    },
    feedback: {
        gap: 10,
        alignItems: "flex-start",
    },
    muted: {
        color: "#587271",
        lineHeight: 21,
    },
    result: {
        color: "#183536",
        fontSize: 15,
        lineHeight: 24,
    },
    error: {
        color: "#a33a2b",
        lineHeight: 21,
    },
});
