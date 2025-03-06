import { useMutation } from "@tanstack/react-query";
import { callLLM } from "@/lib/utils/llm-service";

export function useLLM() {
  return useMutation({
    mutationFn: callLLM,
    retry: 1,
    gcTime: 1000 * 60 * 5, // 5 minutos de cache
  });
}
