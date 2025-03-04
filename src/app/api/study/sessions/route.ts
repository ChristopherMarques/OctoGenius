import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  CreateStudySessionRequest,
  UpdateStudySessionRequest,
} from "@/types/api/requests";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const planId = searchParams.get("planId");

    if (!planId) throw new Error("Plan ID is required");

    const { data, error } = await supabaseAdmin
      .from("study_sessions")
      .select("*")
      .eq("study_plan_id", planId);

    if (error) throw error;
    return NextResponse.json({ success: true, data }, { status: 200 });
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
