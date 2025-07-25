import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Inicializa o Google AI Client
const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY || ""
);

// Zod Schemas para validação
const userAnswerSchema = z.object({
  questionId: z.string().uuid(),
  selectedAnswerId: z.string().uuid(),
});

const submitDiagnosticSchema = z.object({
  userAnswers: z.array(userAnswerSchema),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Autenticação e Validação
    const session = await getServerSession();
    const email = session?.user?.email;

    const { data } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    console.log("usuario", data);
    if (!data) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    const userId = data.id;

    const body = await req.json();
    const validation = submitDiagnosticSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: validation.error.errors },
        { status: 400 }
      );
    }
    const { userAnswers } = validation.data;

    // 2. Buscar alternativas corretas e calcular o score
    const questionIds = userAnswers.map((a) => a.questionId);
    const { data: correctAlternatives, error: altError } = await supabaseAdmin
      .from("question_alternatives")
      .select("id, question_id")
      .in("question_id", questionIds)
      .eq("is_correct", true);

    if (altError)
      throw new Error(`Erro ao buscar respostas corretas: ${altError.message}`);

    let correctCount = 0;
    const answersToInsert = userAnswers.map((answer) => {
      const correctAlternative = correctAlternatives.find(
        (alt) => alt.question_id === answer.questionId
      );
      const isCorrect = answer.selectedAnswerId === correctAlternative?.id;
      if (isCorrect) correctCount++;
      return {
        user_id: userId,
        question_id: answer.questionId,
        selected_alternative_id: answer.selectedAnswerId,
        is_correct: isCorrect,
        answered_at: new Date().toISOString(),
      };
    });
    const score = (correctCount / userAnswers.length) * 100;

    // 3. Salvar as respostas do usuário
    const { error: userAnswerError } = await supabaseAdmin
      .from("user_answers")
      .insert(answersToInsert);
    if (userAnswerError)
      throw new Error(`Erro ao salvar respostas: ${userAnswerError.message}`);

    // 4. Salvar o resultado do teste diagnóstico
    // Nota: O schema pede 'knowledge_area_id'. Como o teste pode ter várias,
    // esta lógica pode ser refinada. Por agora, deixaremos nulo ou pegaremos a primeira.
    const { data: diagnosticTest, error: diagnosticError } = await supabaseAdmin
      .from("diagnostic_tests")
      .insert({
        user_id: userId,
        score: score,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (diagnosticError)
      throw new Error(`Erro ao salvar diagnóstico: ${diagnosticError.message}`);

    // 5. Gerar Plano de Estudos com IA
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
      generationConfig: { responseMimeType: "application/json" },
    });

    // Lógica para obter os tópicos para o plano de estudos (pode ser aprimorada)
    const { data: answeredQuestions, error: qError } = await supabaseAdmin
      .from("questions")
      .select("content, subject_id, subjects(name)")
      .in("id", questionIds);

    if (qError)
      throw new Error(`Erro ao buscar questões respondidas: ${qError.message}`);

    const topicsForPlan = answeredQuestions?.map((q) => ({
      topic: q.content, // Usando o enunciado como "tópico"
      subject: q.subjects?.name || "Geral",
    }));

    const prompt = `
        Baseado nos tópicos que o usuário acabou de responder em um teste: ${JSON.stringify(
          topicsForPlan
        )}, 
        crie um plano de estudos de 4 semanas.
        Retorne um JSON com uma lista de sessões de estudo. Cada sessão deve ter:
        {
            "subjectName": "O nome da matéria (ex: 'Matemática')",
            "scheduled_date": "A data para a sessão no formato AAAA-MM-DD",
            "status": "pending"
        }
        Distribua as sessões ao longo de 28 dias a partir de amanhã.
    `;

    const aiResult = await model.generateContent(prompt);
    const aiResponseText = aiResult.response
      .text()
      .replace(/^```json\s*|```$/g, "");
    const studySessionsData = JSON.parse(aiResponseText);

    // 6. Salvar Plano de Estudos no Banco de Dados
    const { data: studyPlan, error: planError } = await supabaseAdmin
      .from("study_plans")
      .insert({
        user_id: userId,
        name: `Plano de Estudos Pós-Diagnóstico - ${new Date().toLocaleDateString()}`,
        start_date: new Date().toISOString(),
        status: "active",
      })
      .select()
      .single();

    if (planError)
      throw new Error(`Erro ao criar plano de estudos: ${planError.message}`);

    const { data: allSubjects, error: allSubjectsError } = await supabaseAdmin
      .from("subjects")
      .select("id, name");
    if (allSubjectsError)
      throw new Error(
        `Erro ao buscar todas as matérias: ${allSubjectsError.message}`
      );

    const sessionsToInsert = studySessionsData
      .map((session: any) => {
        const subject = allSubjects.find((s) => s.name === session.subjectName);
        return {
          study_plan_id: studyPlan.id,
          subject_id: subject?.id, // Pode ser nulo se a IA inventar uma matéria
          scheduled_date: session.scheduled_date,
          status: "pending",
        };
      })
      .filter((s: any) => s.subject_id); // Filtra sessões sem matéria correspondente

    if (sessionsToInsert.length > 0) {
      const { error: sessionsError } = await supabaseAdmin
        .from("study_sessions")
        .insert(sessionsToInsert);
      if (sessionsError)
        throw new Error(
          `Erro ao salvar sessões de estudo: ${sessionsError.message}`
        );
    }

    return NextResponse.json(
      { message: "Plano de estudos criado com sucesso!" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erro na API submit-diagnostic:", error);
    return NextResponse.json(
      { error: error.message || "Ocorreu um erro interno no servidor." },
      { status: 500 }
    );
  }
}
