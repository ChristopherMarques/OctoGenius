import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { jsPDF } from "jspdf";

// Interfaces para tipagem
interface SubjectPerformance {
  total: number;
  correct: number;
  score: number;
}

interface StudySession {
  study_plan_id: string;
  subject_id: string;
  scheduled_date: string;
  duration_minutes: number;
  status: string;
}

interface Subject {
  id: string;
  name: string;
}

// Inicializa o Google AI Client
const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY || ""
);

// Zod Schema para validação
const generateStudyPlanSchema = z.object({
  diagnosticId: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Autenticação e Validação
    const session = await getServerSession();
    const email = session?.user?.email;

    const { data: userData } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!userData) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    const userId = userData.id;

    const body = await req.json();
    const validation = generateStudyPlanSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: validation.error.errors },
        { status: 400 }
      );
    }
    const { diagnosticId } = validation.data;

    // 2. Buscar informações do diagnóstico
    const { data: diagnosticData, error: diagnosticError } = await supabaseAdmin
      .from("diagnostic_tests")
      .select("*")
      .eq("id", diagnosticId)
      .eq("user_id", userId)
      .single();

    if (diagnosticError || !diagnosticData) {
      return NextResponse.json(
        { error: "Diagnóstico não encontrado" },
        { status: 404 }
      );
    }

    // 3. Buscar as respostas do usuário para este diagnóstico
    const { data: userAnswers, error: answersError } = await supabaseAdmin
      .from("user_answers")
      .select("*, question:question_id(*, subject:subject_id(name))")
      .eq("user_id", userId);

    if (answersError) {
      return NextResponse.json(
        { error: "Erro ao buscar respostas" },
        { status: 500 }
      );
    }

    // 4. Analisar desempenho por matéria
    const subjectPerformance: Record<string, SubjectPerformance> = {};
    userAnswers.forEach((answer) => {
      const subjectName = answer.question?.subject?.name || "Geral";
      if (!subjectPerformance[subjectName]) {
        subjectPerformance[subjectName] = {
          total: 0,
          correct: 0,
          score: 0,
        };
      }
      
      subjectPerformance[subjectName].total += 1;
      if (answer.is_correct) {
        subjectPerformance[subjectName].correct += 1;
      }
    });

    // Calcular pontuação por matéria
    Object.keys(subjectPerformance).forEach((subject) => {
      const { total, correct } = subjectPerformance[subject];
      subjectPerformance[subject].score = total > 0 ? (correct / total) * 100 : 0;
    });

    // 5. Gerar plano de estudos com IA
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `
      Você é um especialista em educação e preparação para vestibulares.
      Baseado no desempenho do estudante em um teste diagnóstico, crie um plano de estudos personalizado.
      
      Desempenho do estudante por matéria:
      ${JSON.stringify(subjectPerformance)}
      
      Crie um plano de estudos de 4 semanas que priorize as matérias com menor pontuação.
      O plano deve incluir:
      
      1. Um resumo geral do desempenho e áreas que precisam de mais atenção
      2. Objetivos de aprendizagem para cada matéria
      3. Um cronograma semanal detalhado com sessões de estudo
      4. Recursos recomendados para cada matéria
      5. Estratégias de estudo personalizadas
      
      Retorne um JSON com a seguinte estrutura:
      {
        "resumo": "Texto com análise geral do desempenho",
        "objetivos": [
          { "materia": "Nome da matéria", "objetivo": "Descrição do objetivo" }
        ],
        "cronograma": [
          {
            "semana": 1,
            "sessoes": [
              {
                "dia": "Segunda-feira",
                "materia": "Nome da matéria",
                "topico": "Tópico específico",
                "duracao": "Duração em minutos",
                "prioridade": "alta/média/baixa"
              }
            ]
          }
        ],
        "recursos": [
          { "materia": "Nome da matéria", "recursos": ["Recurso 1", "Recurso 2"] }
        ],
        "estrategias": [
          { "materia": "Nome da matéria", "estrategia": "Descrição da estratégia" }
        ]
      }
    `;

    const aiResult = await model.generateContent(prompt);
    const aiResponseText = aiResult.response
      .text()
      .replace(/^```json\s*|```$/g, "");
    const studyPlanData = JSON.parse(aiResponseText);

    // 6. Salvar o plano de estudos no banco de dados
    const { data: studyPlan, error: planError } = await supabaseAdmin
      .from("study_plans")
      .insert({
        user_id: userId,
        name: `Plano de Estudos Personalizado - ${new Date().toLocaleDateString('pt-BR')}`,
        start_date: new Date().toISOString(),
        status: "active",
      })
      .select()
      .single();

    if (planError) {
      return NextResponse.json(
        { error: "Erro ao criar plano de estudos" },
        { status: 500 }
      );
    }

    // 7. Buscar todas as matérias para mapear nomes para IDs
    const { data: allSubjects, error: subjectsError } = await supabaseAdmin
      .from("subjects")
      .select("id, name");

    if (subjectsError || !allSubjects) {
      return NextResponse.json(
        { error: "Erro ao buscar matérias" },
        { status: 500 }
      );
    }
    
    const subjects: Subject[] = allSubjects;

    // 8. Criar sessões de estudo no banco de dados
    const studySessions: StudySession[] = [];
    
    studyPlanData.cronograma.forEach((semana: any) => {
      semana.sessoes.forEach((sessao: any) => {
        const subject = subjects.find((s) => s.name === sessao.materia);
        if (subject) {
          // Calcular a data com base na semana e dia
          const today = new Date();
          const weekOffset = (semana.semana - 1) * 7;
          const dayOffset = getDayOffset(sessao.dia);
          const sessionDate = new Date(today);
          sessionDate.setDate(today.getDate() + weekOffset + dayOffset);
          
          studySessions.push({
            study_plan_id: studyPlan.id,
            subject_id: subject.id,
            scheduled_date: sessionDate.toISOString().split('T')[0],
            duration_minutes: parseInt(sessao.duracao) || 60,
            status: "pending",
          });
        }
      });
    });

    if (studySessions.length > 0) {
      const { error: sessionsError } = await supabaseAdmin
        .from("study_sessions")
        .insert(studySessions);

      if (sessionsError) {
        return NextResponse.json(
          { error: "Erro ao criar sessões de estudo" },
          { status: 500 }
        );
      }
    }

    // 9. Retornar o plano de estudos e o ID para download do PDF
    return NextResponse.json({
      message: "Plano de estudos criado com sucesso",
      studyPlanId: studyPlan.id,
      studyPlanData,
    });

  } catch (error: any) {
    console.error("Erro na API generate-study-plan:", error);
    return NextResponse.json(
      { error: error.message || "Ocorreu um erro interno no servidor." },
      { status: 500 }
    );
  }
}

// Função auxiliar para converter dia da semana em offset numérico
function getDayOffset(dayName: string): number {
  const days: Record<string, number> = {
    "Segunda-feira": 0,
    "Terça-feira": 1,
    "Quarta-feira": 2,
    "Quinta-feira": 3,
    "Sexta-feira": 4,
    "Sábado": 5,
    "Domingo": 6,
  };
  return days[dayName] ?? 0;
}
