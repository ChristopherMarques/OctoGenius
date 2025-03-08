import { useMutation } from "@tanstack/react-query";
import { callLLM } from "@/lib/utils/llm-service";
import { LLMConfig } from "@/lib/utils/llmConfig";

export function useLLM() {
  return useMutation({
    mutationFn: (config: LLMConfig) => callLLM(config),
    retry: 1,
    gcTime: 1000 * 60 * 5, // 5 minutos de cache
  });
}
