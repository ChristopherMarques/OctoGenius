import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getGoogleAccessToken, createCalendarEvent } from "@/lib/google";
import { authOptions } from "@/lib/authOptions";

export async function POST() {
  try {
    const session = await getServerSession(authOptions as any);
    const userId = (session as any)?.user?.id as string | undefined;

    if (!userId) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { data: sessions, error } = await supabaseAdmin
      .from("study_sessions")
      .select("id, scheduled_date, duration_minutes, topic, task_type, status, study_plans!inner(user_id)")
      .eq("study_plans.user_id", userId);

    if (error) {
      return NextResponse.json({ error: "Erro ao buscar sessões" }, { status: 500 });
    }

    const accessToken = await getGoogleAccessToken(userId);

    let created = 0;
    for (const s of sessions || []) {
      if (!s.scheduled_date || !s.duration_minutes) continue;

      const date = new Date(s.scheduled_date);
      date.setHours(18, 0, 0, 0);
      const end = new Date(date.getTime() + (s.duration_minutes || 30) * 60 * 1000);

      const title = s.topic || "Sessão de Estudo";
      const description = s.task_type ? `Tipo: ${s.task_type}` : "Sessão de estudo";

      await createCalendarEvent(accessToken, title, description, date.toISOString(), end.toISOString());
      created += 1;
    }

    return NextResponse.json({ ok: true, created });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Erro ao sincronizar com Google Calendar" }, { status: 500 });
  }
}
