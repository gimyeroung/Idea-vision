import { useState } from "react";

import { generateIdeasWithGemini } from "./llmClient";
import type { Idea } from "./types";

export function useIdeaGeneration() {
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generate = async (analysis: string) => {
        setIsLoading(true);
        setError(null);
        setIdeas([]);

        try {
            const generatedIdeas = await generateIdeasWithGemini({ analysis });
            setIdeas(generatedIdeas);
        } catch (caughtError) {
            setError(
                caughtError instanceof Error
                    ? caughtError.message
                    : "아이디어 생성 중 오류가 발생했습니다.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    return { ideas, isLoading, error, generate };
}
