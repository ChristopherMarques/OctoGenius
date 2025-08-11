import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions as any);
  const userId = (session as any)?.user?.id as string | undefined;

  if (!userId) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = await req.json();
  const { questions, userAnswers } = body || {};

  const today = new Date();
  const planId = crypto.randomUUID();

  const { error: planError } = await supabaseAdmin.from("study_plans").insert({
    id: planId,
    user_id: userId,
    name: "Plano de Estudos Personalizado",
    start_date: today.toISOString().slice(0, 10),
    status: "active",
  });

  if (planError) {
    return NextResponse.json({ error: "Erro ao criar plano" }, { status: 500 });
  }

  let subjectId: string | null = null;
  {
    const { data: subj, error: subjErr } = await supabaseAdmin
      .from("subjects")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (subjErr) {
      return NextResponse.json({ error: "Erro ao consultar matérias" }, { status: 500 });
    }

    if (subj?.id) {
      subjectId = subj.id as string;
    } else {
      const kgId = crypto.randomUUID();
      const { error: kgErr } = await supabaseAdmin.from("knowledge_areas").insert({
        id: kgId,
        name: "Geral",
      });
      if (kgErr) {
        return NextResponse.json({ error: "Erro ao criar área de conhecimento" }, { status: 500 });
      }
      const newSubjectId = crypto.randomUUID();
      const { error: createSubjErr } = await supabaseAdmin.from("subjects").insert({
        id: newSubjectId,
        knowledge_area_id: kgId,
        name: "Estudos Gerais",
      });
      if (createSubjErr) {
        return NextResponse.json({ error: "Erro ao criar matéria padrão" }, { status: 500 });
      }
      subjectId = newSubjectId;
    }
  }

  const makeSession = (index: number, topic: string, taskType: string, duration: number) => {
    const d = new Date();
    d.setDate(d.getDate() + index);
    const scheduled_date = d.toISOString().slice(0, 10);
    return {
      study_plan_id: planId,
      subject_id: subjectId!,
      scheduled_date,
      duration_minutes: duration,
      status: "pending",
      topic,
      task_type: taskType,
    };
  };

  const sessions = [
    makeSession(0, "Trigonometria", "Estudo", 45),
    makeSession(1, "Leis de Newton", "Exercícios", 30),
    makeSession(2, "Interpretação de Texto", "Revisão", 40),
    makeSession(3, "Química Orgânica", "Estudo", 50),
    makeSession(4, "Biologia Celular", "Exercícios", 35),
  ];

  const { error: sessError } = await supabaseAdmin.from("study_sessions").insert(sessions);

  if (sessError) {
    return NextResponse.json({ error: "Erro ao criar sessões" }, { status: 500 });
  }

  return NextResponse.json({ studyPlanId: planId });
}
