import { NextRequest, NextResponse } from "next/server";
import { withRateLimit } from "@/lib/utils/with-rate-limit";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";

import { AIEngineAgent, defaultAgent } from "@/lib/agents";

export const runtime = "edge";

async function handlePost(req: NextRequest): Promise<NextResponse> {
  try {
    const {
      prompt,
      agent,
    }: {
      prompt: string;
      agent?: AIEngineAgent;
    } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt é obrigatório" },
        { status: 400 }
      );
    }

    const engineAgent = agent || defaultAgent;

    const google = createGoogleGenerativeAI({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY,
    });

    const model = google("gemini-2.5-flash");

    const result = await streamText({
      model: model,
      system: `
        ${engineAgent.personality}
        ${engineAgent.instructions}
        O modo de resposta atual é: ${engineAgent.answer_type}.
      `,
      prompt: prompt,
    });

    return new NextResponse(result.toDataStream(), {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Erro ao chamar a IA:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro interno no servidor." },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit(handlePost);
