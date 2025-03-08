export interface LLMConfig {
  prompt: string;
  options?: {
    temperature?: number;
    maxTokens?: number;
    type?: "text" | "json";
  };
}
