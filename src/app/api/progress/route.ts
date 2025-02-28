import { supabase } from "@/lib/supabase";
import { apiResponse } from "@/lib/utils/api-response";
import { withRateLimit } from "@/lib/utils/with-rate-limit";
import { UpdateProgressRequest } from "@/types/api/requests";
import { NextRequest, NextResponse } from "next/server";

async function handleGet(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) throw new Error("User ID is required");

    const { data, error } = await supabase
      .from("subject_progress")
      .select(
        `
        *,
        subjects (
          name,
          knowledge_area_id
        )
      `
      )
      .eq("user_id", userId);

    if (error) throw error;
    return apiResponse.success(data);
  } catch (error) {
    return apiResponse.error((error as Error).message);
  }
}

async function handlePatch(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) throw new Error("User ID is required");

    const body: UpdateProgressRequest = await request.json();

    const { data, error } = await supabase
      .from("subject_progress")
      .upsert(
        {
          user_id: userId,
          subject_id: body.subjectId,
          mastery_level: body.masteryLevel,
          questions_answered: body.questionsAnswered,
          correct_answers: body.correctAnswers,
          last_reviewed_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,subject_id",
        }
      )
      .select()
      .single();

    if (error) throw error;
    return apiResponse.success(data);
  } catch (error) {
    return apiResponse.error((error as Error).message);
  }
}

export const GET = withRateLimit(async (request: NextRequest) => {
  return NextResponse.json(await handleGet(request));
});

export const PATCH = withRateLimit(async (request: NextRequest) => {
  return NextResponse.json(await handlePatch(request));
});
