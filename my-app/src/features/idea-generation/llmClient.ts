import { GoogleGenerativeAI } from "@google/generative-ai";

import { getGeminiApiKey } from "../../config/env";
import type { Idea, IdeaGenerationInput } from "./types";

const modelName = "gemini-3.6-flash";

function parseIdeas(text: string): Idea[] {
    const cleaned = text
        .trim()
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/, "");
    const parsed: unknown = JSON.parse(cleaned);

    if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error("Gemini가 추천 아이디어를 올바른 형식으로 반환하지 않았습니다.");
    }

    return parsed.map((item, index) => {
        if (typeof item !== "object" || item === null) {
            throw new Error(`추천 아이디어 ${index + 1}의 형식이 올바르지 않습니다.`);
        }

        const record = item as Record<string, unknown>;
        const steps = record.steps;
        if (
            typeof record.title !== "string" ||
            typeof record.summary !== "string" ||
            typeof record.whyItFits !== "string" ||
            !Array.isArray(steps) ||
            !steps.every((step: unknown): step is string => typeof step === "string")
        ) {
            throw new Error(`추천 아이디어 ${index + 1}의 형식이 올바르지 않습니다.`);
        }

        return {
            title: record.title,
            summary: record.summary,
            whyItFits: record.whyItFits,
            steps,
        };
    });
}

export async function generateIdeasWithGemini(
    input: IdeaGenerationInput,
): Promise<Idea[]> {
    const client = new GoogleGenerativeAI(getGeminiApiKey());
    const model = client.getGenerativeModel({ model: modelName });
    const response = await model.generateContent(`다음은 사진을 분석한 결과야. 이 분석을 바탕으로 실제로 시도해볼 만한 창의적인 아이디어를 한국어로 3개 추천해줘.

분석 결과:
${input.analysis}

반드시 아래 JSON 배열만 반환해. 마크다운, 설명, 코드 펜스는 절대 넣지 마.
[
  {
	"title": "짧고 기억하기 쉬운 아이디어 이름",
	"summary": "무엇을 만들거나 어떻게 활용하는지 한 문장",
	"whyItFits": "사진 속 대상의 어떤 특징을 활용하는지",
	"steps": ["실행 단계 1", "실행 단계 2", "실행 단계 3"]
  }
]
이미지 분석에 없는 내용을 사실처럼 단정하지 말고, 필요한 경우 가정임을 밝혀줘.`);

    const text = response.response.text();
    if (!text.trim()) {
        throw new Error("Gemini가 추천 아이디어를 반환하지 않았습니다.");
    }

    try {
        return parseIdeas(text);
    } catch {
        throw new Error("Gemini의 아이디어 응답을 읽지 못했습니다. 다시 시도해주세요.");
    }
}
