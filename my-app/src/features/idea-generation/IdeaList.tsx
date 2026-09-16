import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import type { Idea } from "./types";

type IdeaListProps = {
    ideas: Idea[];
    isLoading: boolean;
    error: string | null;
};

export function IdeaList({ ideas, isLoading, error }: IdeaListProps) {
    return (
        <View style={styles.section}>
            <Text style={styles.eyebrow}>IDEA LAB</Text>
            <Text style={styles.title}>이 사진으로 해볼 수 있는 일</Text>
            {isLoading ? (
                <View style={styles.feedback}>
                    <ActivityIndicator color="#e56b4d" />
                    <Text style={styles.muted}>분석 결과를 바탕으로 아이디어를 만드는 중...</Text>
                </View>
            ) : error ? (
                <Text style={styles.error}>{error}</Text>
            ) : ideas.length > 0 ? (
                ideas.map((idea, index) => (
                    <View key={`${idea.title}-${index}`} style={styles.idea}>
                        <Text style={styles.number}>0{index + 1}</Text>
                        <View style={styles.ideaBody}>
                            <Text style={styles.ideaTitle}>{idea.title}</Text>
                            <Text style={styles.summary}>{idea.summary}</Text>
                            <Text style={styles.why}>{idea.whyItFits}</Text>
                            {idea.steps.map((step, stepIndex) => (
                                <Text key={`${idea.title}-step-${stepIndex}`} style={styles.step}>
                                    {stepIndex + 1}. {step}
                                </Text>
                            ))}
                        </View>
                    </View>
                ))
            ) : (
                <Text style={styles.muted}>사진을 분석하면 맞춤 아이디어가 여기에 나타납니다.</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        gap: 12,
    },
    eyebrow: {
        color: "#e56b4d",
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 1.2,
    },
    title: {
        color: "#173b3a",
        fontSize: 22,
        fontWeight: "700",
    },
    feedback: {
        alignItems: "flex-start",
        gap: 10,
        padding: 18,
        backgroundColor: "#fffaf2",
        borderRadius: 14,
    },
    muted: {
        color: "#587271",
        lineHeight: 21,
    },
    error: {
        color: "#a33a2b",
        lineHeight: 21,
    },
    idea: {
        flexDirection: "row",
        gap: 14,
        padding: 16,
        backgroundColor: "#fffaf2",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#eaded0",
    },
    number: {
        color: "#e56b4d",
        fontSize: 16,
        fontWeight: "700",
    },
    ideaBody: {
        flex: 1,
        gap: 8,
    },
    ideaTitle: {
        color: "#173b3a",
        fontSize: 18,
        fontWeight: "700",
    },
    summary: {
        color: "#294b49",
        fontSize: 15,
        lineHeight: 22,
    },
    why: {
        color: "#587271",
        fontSize: 13,
        lineHeight: 19,
    },
    step: {
        color: "#294b49",
        fontSize: 14,
        lineHeight: 20,
    },
});
