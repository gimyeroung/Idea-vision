import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import { IdeaList } from "../features/idea-generation/IdeaList";
import { useIdeaGeneration } from "../features/idea-generation/useIdeaGeneration";
import { AnalysisPanel } from "../features/vision-analysis/AnalysisPanel";
import { useVisionAnalysis } from "../features/vision-analysis/useVisionAnalysis";

export default function Index() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const { result, isLoading, error, analyze } = useVisionAnalysis();
  const {
    ideas,
    isLoading: isGeneratingIdeas,
    error: ideaError,
    generate,
  } = useIdeaGeneration();

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("권한 필요", "사진을 선택하려면 사진 보관함 권한이 필요합니다.");
      return;
    }

    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
      base64: true,
    });

    if (!picked.canceled) {
      const asset = picked.assets[0];
      setImageUri(asset.uri);
      if (asset.base64) {
        const analysisResult = await analyze({
          base64: asset.base64,
          mimeType: asset.mimeType ?? "image/jpeg",
        });
        if (analysisResult) {
          await generate(analysisResult.text);
        }
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Idea Vision</Text>
        <Text style={styles.subtitle}>
          사진을 분석하고, 바로 실행해볼 수 있는 아이디어를 추천받아보세요.
        </Text>

        <Pressable
          style={styles.pickButton}
          onPress={pickImage}
          disabled={isLoading || isGeneratingIdeas}
        >
          <Text style={styles.pickButtonText}>
            {isLoading
              ? "사진 분석 중..."
              : isGeneratingIdeas
                ? "아이디어 만드는 중..."
                : "사진 선택하고 아이디어 받기"}
          </Text>
        </Pressable>

        {imageUri ? <Image source={{ uri: imageUri }} style={styles.preview} /> : null}
        <AnalysisPanel result={result} isLoading={isLoading} error={error} />
        <IdeaList ideas={ideas} isLoading={isGeneratingIdeas} error={ideaError} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f7ff",
  },
  container: {
    padding: 24,
    backgroundColor: "#f6f3eb",
    gap: 16,
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontWeight: "700",
    color: "#173b3a",
    fontSize: 34,
    letterSpacing: 0,
  },
  subtitle: {
    fontSize: 16,
    color: "#587271",
    lineHeight: 23,
  },
  pickButton: {
    backgroundColor: "#e56b4d",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  pickButtonText: {
    color: "#fffaf2",
    fontSize: 16,
    fontWeight: "700",
  },
  preview: {
    width: "100%",
    aspectRatio: 1.3,
    borderRadius: 16,
    backgroundColor: "#dce9e4",
  },
});
