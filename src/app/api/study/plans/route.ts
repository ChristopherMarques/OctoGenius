import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { withRateLimit } from "@/lib/utils/with-rate-limit";
import {
  CreateStudyPlanRequest,
  UpdateStudyPlanRequest,
} from "@/types/api/requests";
import { NextRequest, NextResponse } from "next/server";

async function handleGet(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) throw new Error("User ID is required");

    const { data, error } = await supabaseAdmin
      .from("study_plans")
      .select(
        `
        *,
        study_sessions (*)
      `
      )
      .eq("user_id", userId);

    if (error) throw error;
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}

async function handlePost(request: NextRequest) {
  try {
    const body: CreateStudyPlanRequest = await request.json();

    const { data, error } = await supabaseAdmin
      .from("study_plans")
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

async function handlePatch(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const planId = searchParams.get("planId");
    if (!planId) throw new Error("Plan ID is required");

    const body: UpdateStudyPlanRequest = await request.json();

    const { data, error } = await supabaseAdmin
      .from("study_plans")
      .update(body)
      .eq("id", planId)
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

export const GET = withRateLimit(async (request: NextRequest) => {
  const response = await handleGet(request);
  return NextResponse.json(response.body, { status: response.status });
});

export const POST = withRateLimit(async (request: NextRequest) => {
  const response = await handlePost(request);
  return NextResponse.json(response.body, { status: response.status });
});

export const PATCH = withRateLimit(async (request: NextRequest) => {
  const response = await handlePatch(request);
  return NextResponse.json(response.body, { status: response.status });
});
