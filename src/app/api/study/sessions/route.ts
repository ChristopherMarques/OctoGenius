import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  CreateStudySessionRequest,
  UpdateStudySessionRequest,
} from "@/types/api/requests";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const planId = searchParams.get("planId");
    const me = searchParams.get("me");

    if (planId) {
      const { data, error } = await supabaseAdmin
        .from("study_sessions")
        .select("*")
        .eq("study_plan_id", planId);

      if (error) throw error;
      return NextResponse.json({ success: true, data }, { status: 200 });
    }

    if (me) {
      const session = await getServerSession(authOptions as any);
      const userId = (session as any)?.user?.id as string | undefined;
      if (!userId) {
        return NextResponse.json({ success: false, error: "Não autenticado" }, { status: 401 });
      }

      const { data, error } = await supabaseAdmin
        .from("study_sessions")
        .select("id, scheduled_date, duration_minutes, topic, task_type, status, study_plans!inner(user_id)")
        .eq("study_plans.user_id", userId)
        .order("scheduled_date", { ascending: true });

      if (error) throw error;

      const sessions = (data || []).map((s: any) => ({
        id: s.id,
        scheduled_date: s.scheduled_date,
        duration_minutes: s.duration_minutes,
        topic: s.topic,
        task_type: s.task_type,
        status: s.status,
      }));

      return NextResponse.json({ success: true, sessions }, { status: 200 });
    }

    return NextResponse.json({ success: false, error: "Parâmetros inválidos" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: CreateStudySessionRequest = await request.json();

    const { data, error } = await supabaseAdmin
      .from("study_sessions")
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    if (!sessionId) throw new Error("Session ID is required");

    const body: UpdateStudySessionRequest = await request.json();

    const { data, error } = await supabaseAdmin
      .from("study_sessions")
      .update(body)
      .eq("id", sessionId)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}
