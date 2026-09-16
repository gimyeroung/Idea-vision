import { useState } from "react";

import { analyzeImageWithGemini } from "./geminiVisionClient";
import type { VisionAnalysisInput, VisionAnalysisResult } from "./types";

export function useVisionAnalysis() {
    const [result, setResult] = useState<VisionAnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const analyze = async (input: VisionAnalysisInput) => {
        setIsLoading(true);
        setError(null);

        try {
            const analysisResult = await analyzeImageWithGemini(input);
            setResult(analysisResult);
            return analysisResult;
        } catch (caughtError) {
            setResult(null);
            setError(
                caughtError instanceof Error
                    ? caughtError.message
                    : "이미지 분석 중 오류가 발생했습니다.",
            );
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { result, isLoading, error, analyze };
}
