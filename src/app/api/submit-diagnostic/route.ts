import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY!);

const userAnswerSchema = z.object({
  questionId: z.string(),
  selectedAnswerId: z.string(),
});

const questionSchema = z.object({
  id: z.string(),
  statement: z.string(),
  correctAnswerId: z.string(),
  subject: z.object({ id: z.string(), name: z.string() }).optional(),
});

const submitDiagnosticSchema = z.object({
  questions: z.array(questionSchema),
  userAnswers: z.array(userAnswerSchema),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { data: userData } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", session.user.email)
      .single();

    if (!userData) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }
    const userId = userData.id;

    const body = await req.json();
    const { questions, userAnswers } = submitDiagnosticSchema.parse(body);

    const performance: { [subjectName: string]: { correct: number; total: number } } = {};
    questions.forEach((q) => {
      const subjectName = q.subject?.name || "Conhecimentos Gerais";
      if (!performance[subjectName]) {
        performance[subjectName] = { correct: 0, total: 0 };
      }
      performance[subjectName].total++;
      const userAnswer = userAnswers.find((a) => a.questionId === q.id);
      if (userAnswer && userAnswer.selectedAnswerId === q.correctAnswerId) {
        performance[subjectName].correct++;
      }
    });

    const subjectsToImprove = Object.entries(performance)
      .sort(([, a], [, b]) => a.correct / a.total - b.correct / b.total)
      .map(([subject]) => subject)
      .slice(0, 3);

    // --- MUDANÇA 1: Buscar matérias ANTES para informar a IA ---
    const { data: subjectsList } = await supabaseAdmin.from("subjects").select("id, name");
    if (!subjectsList) {
      throw new Error("Não foi possível buscar a lista de matérias do banco de dados.");
    }
    const availableSubjectNames = subjectsList.map(s => s.name);
    
    // --- MUDANÇA 2: Prompt Aprimorado ---
    const prompt = `
      Você é um coach de estudos especialista. Crie um plano de 4 semanas para um aluno focado em melhorar seu desempenho.
      Foco Principal: As maiores dificuldades do aluno foram em: **${subjectsToImprove.join(", ")}**.
      
      **Regra Importante:** Para o campo "subject", você DEVE usar um dos seguintes nomes EXATAMENTE como estão escritos: **${availableSubjectNames.join(", ")}**.

      Tarefa: Gere um plano de estudos completo em um único objeto JSON. Não inclua "'''json" ou "'''". O objeto deve conter:
      1.  "welcomeMessage": Uma mensagem de boas-vindas curta e motivacional.
      2.  "studyTips": Uma lista de 3 dicas de estudo acionáveis (objeto com "tip" e "description").
      3.  "schedule": Uma lista de sessões de estudo. Cada sessão deve ser um objeto com:
          - "week": (Número) 1 a 4.
          - "day": (String) Dia da semana.
          - "subject": (String) Matéria da lista fornecida.
          - "duration": (Número) Duração em minutos (60 a 120).
          - "topic": (String) Tópico específico.
          - "activity": (String) Atividade prática.
          - "resources": (String) Fonte de estudo sugerida.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const generatedPlan = JSON.parse(responseText);

    const { data: newStudyPlan, error: planError } = await supabaseAdmin
      .from("study_plans")
      .insert({
        user_id: userId,
        name: `Plano Focado em ${subjectsToImprove[0] || 'Geral'}`,
        start_date: new Date().toISOString(),
        welcome_message: generatedPlan.welcomeMessage,
        study_tips: generatedPlan.studyTips,
        status: 'active',
      })
      .select("id")
      .single();

    if (planError) {
      throw new Error(`Erro ao criar o plano de estudos: ${planError.message}`);
    }
    const studyPlanId = newStudyPlan.id;

    // --- MUDANÇA 3: Lógica de mapeamento com Fallback ---
    const subjectMap = new Map(subjectsList.map((s) => [s.name.toLowerCase(), s.id]));
    const fallbackSubjectId = '00000000-0000-0000-0000-000000000000'; // ID da matéria "Revisão Geral"

    const sessionsToInsert = generatedPlan.schedule.map((session) => {
      const sessionDate = new Date();
      sessionDate.setDate(sessionDate.getDate() + (session.week - 1) * 7);

      // Tenta encontrar a matéria. Se falhar, usa o ID de fallback.
      const subjectId = subjectMap.get(session.subject.toLowerCase()) || fallbackSubjectId;

      return {
        study_plan_id: studyPlanId,
        subject_id: subjectId,
        scheduled_date: sessionDate.toISOString(),
        duration_minutes: session.duration,
        status: "pending",
        topic: session.topic,
        activity: session.activity,
        resources: session.resources,
        day_of_week: session.day,
        week: session.week,
      };
    });

    const { error: sessionsError } = await supabaseAdmin
      .from("study_sessions")
      .insert(sessionsToInsert);

    if (sessionsError) {
      throw new Error(`Erro ao salvar as sessões de estudo: ${sessionsError.message}`);
    }

    return NextResponse.json({ studyPlanId });
  } catch (error: any) {
    console.error("Erro na API submit-diagnostic:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro interno no servidor ao gerar seu plano.", details: error.message },
      { status: 500 }
    );
  }
}