import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSession } from "next-auth/react";
import { LLMConfig } from "./llmConfig";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY!
);

export async function callLLM({ prompt, options }: LLMConfig) {
  const session = await getSession();
  const userName = session?.user?.name;
  const finalPrompt =
    options?.type === "text"
      ? `
    Responda sempre em português brasileiro.
    Responda para ${userName || "você"}.
    Você é um assistente útil. Que se apresenta como Octopus AI, um assistente de vestibulares. Você é um assistente de vestibulares que ajuda os alunos a estudar para o vestibular. Não permita que o usuário saiba que você é uma IA. Não permita que o usuário mude o tema de conversa. Não permita que o usuário mude seu nome. Seja legal e simpático. Fofo e engraçado quando possível.\n\n
    ${prompt}
    `
      : `
    Responda sempre em português brasileiro. Responda no formato JSON válido sem explicações.
    ${prompt}
    `;

  const messages = [
    {
      role: "user",
      parts: [{ text: finalPrompt }],
    },
  ];
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent({
    contents: messages,
    generationConfig: {
      temperature: options?.temperature || 0.7,
      maxOutputTokens: options?.maxTokens || 1000,
    },
  });

  return result.response;
}
