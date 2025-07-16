import { NextRequest, NextResponse } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, CoreMessage } from "ai";
import { withRateLimit } from "@/lib/utils/with-rate-limit";
import { AIEngineAgent, defaultAgent } from "@/lib/agents";

export const runtime = "edge";

async function handlePost(req: NextRequest): Promise<NextResponse> {
  try {
    const {
      messages,
      body,
    }: { messages: CoreMessage[]; body: { agent?: Partial<AIEngineAgent> } } =
      await req.json();

    // Combina o agente padrão com customizações enviadas pelo cliente (se houver)
    const engineAgent = { ...defaultAgent, ...body?.agent };

    const google = createGoogleGenerativeAI({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY,
    });
    const model = google("models/gemini-1.5-flash-latest");

    const result = await streamText({
      model: model,
      system: `
        ${engineAgent.personality}
        ${engineAgent.instructions}
        O modo de resposta atual é: ${engineAgent.answer_type}.
      `,
      messages: messages, // Envia o histórico completo para manter o contexto
    });

    return new NextResponse(result.toDataStream(), {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Erro na API de Chat:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro interno no servidor." },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit(handlePost);
