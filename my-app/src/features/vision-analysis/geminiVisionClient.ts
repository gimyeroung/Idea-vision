import { GoogleGenerativeAI } from "@google/generative-ai";

import { getGeminiApiKey } from "../../config/env";
import type { VisionAnalysisInput, VisionAnalysisResult } from "./types";

const modelName = "gemini-3.6-flash";

export async function analyzeImageWithGemini(
    input: VisionAnalysisInput,
): Promise<VisionAnalysisResult> {
    const client = new GoogleGenerativeAI(getGeminiApiKey());
    const model = client.getGenerativeModel({ model: modelName });
    const response = await model.generateContent([
        {
            text: "이 이미지를 한국어로 분석해줘. 물체의 정확한 이름, 카테고리, 주요 특징, 재질이나 용도, 흥미로운 관찰을 짧은 제목과 bullet 형식으로 설명해줘. 이미지에 없는 정보는 추측이라고 밝혀줘.",
        },
        {
            inlineData: {
                data: input.base64,
                mimeType: input.mimeType,
            },
        },
    ]);

    const text = response.response.text().trim();
    if (!text) {
        throw new Error("Gemini가 분석 결과를 반환하지 않았습니다.");
    }

    return { text };
}
