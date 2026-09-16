const geminiApiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

export function getGeminiApiKey() {
    if (!geminiApiKey) {
        throw new Error(
            "EXPO_PUBLIC_GEMINI_API_KEY가 설정되지 않았습니다. .env 파일을 확인하세요.",
        );
    }

    return geminiApiKey;
}
