import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { QuestoesDiagnosticoModelo } from "@/lib/utils/constants";
import { callLLM } from "@/lib/utils/llm-service";
import { withRateLimit } from "@/lib/utils/with-rate-limit";

async function diagnosticPostHandler(request: NextRequest) {
  const { intention_in, userId } = await request.json();

  if (!intention_in || !userId) {
    return NextResponse.json(
      { error: "Campos obrigatórios ausentes" },
      { status: 400 }
    );
  }

  try {
    const llmResponse = await callLLM({
      prompt: `Gere 2 questões (apenas duas questões por disciplina) para cada disciplina do vestibular ${intention_in}, responda no formato JSON válido sem explicações. Responda no formato: \n\n ${JSON.stringify(
        QuestoesDiagnosticoModelo,
        null,
        2
      )}`,
      options: {
        type: "json",
        temperature: 0.9,
        maxTokens: 3000,
      },
    });

    const rawText =
      llmResponse?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

    const cleanedText = rawText.replace(/```json|```/g, "").trim();

    const questions = JSON.parse(cleanedText);

    const { data: newTest, error: insertError } = await supabaseAdmin
      .from("diagnostic_tests")
      .insert({
        user_id: userId,
        intention_in,
        questions,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("Erro ao inserir no banco:", insertError);
      throw new Error(`Erro ao salvar teste: ${insertError.message}`);
    }

    return NextResponse.json(newTest);
  } catch (error) {
    console.error("Erro ao processar o POST /api/diagnostic:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Erro desconhecido" },
      { status: 500 }
    );
  }
}

async function diagnosticGetHandler(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json(
      { error: "ID de usuário inválido " + userId },
      { status: 400 }
    );
  }

  try {
    const { data: diagnostic } = await supabaseAdmin
      .from("diagnostic_tests")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (!diagnostic)
      return NextResponse.json(
        { error: "Teste não encontrado" },
        { status: 404 }
      );

    return NextResponse.json(diagnostic);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Erro desconhecido" },
      { status: 500 }
    );
  }
}

async function diagnosticPatchHandler(request: NextRequest) {
  const { userId, questions_answers, score } = await request.json();

  if (!userId || !questions_answers || !score) {
    return NextResponse.json(
      { error: "Campos obrigatórios ausentes" },
      { status: 400 }
    );
  }

  try {
    const { data: updatedTest, error: updateError } = await supabaseAdmin
      .from("diagnostic_tests")
      .update({
        questions_answers,
        score,
        completed_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .maybeSingle();

    if (updateError) {
      console.error("Erro ao atualizar o teste:", updateError);
      throw new Error(`Erro ao atualizar teste: ${updateError.message}`);
    }

    return NextResponse.json(updatedTest);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Erro desconhecido" },
      { status: 500 }
    );
  }
}

export const GET = withRateLimit(diagnosticGetHandler);
export const POST = withRateLimit(diagnosticPostHandler);
export const PATCH = withRateLimit(diagnosticPatchHandler);
