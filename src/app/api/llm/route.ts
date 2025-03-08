import { NextResponse } from "next/server";
import { withRateLimit } from "@/lib/utils/with-rate-limit";
import { callLLM } from "@/lib/utils/llm-service";

export const runtime = "edge";

async function handlePost(req: Request) {
  const { prompt, options } = await req.json();

  try {
    const response = await callLLM({ prompt, options });
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao chamar a IA", details: error },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit(handlePost);
