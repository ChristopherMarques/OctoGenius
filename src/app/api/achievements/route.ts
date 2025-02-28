import { supabase } from "@/lib/supabase";
import { apiResponse } from "@/lib/utils/api-response";
import { withRateLimit } from "@/lib/utils/with-rate-limit";
import { NextRequest, NextResponse } from "next/server";

async function handleGet(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) throw new Error("User ID is required");

    const { data, error } = await supabase
      .from("user_achievements")
      .select(
        `
        *,
        achievements (*)
      `
      )
      .eq("user_id", userId);

    if (error) throw error;
    return apiResponse.success(data);
  } catch (error) {
    return apiResponse.error((error as Error).message);
  }
}

async function handlePost(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const achievementId = searchParams.get("achievementId");

    if (!userId) throw new Error("User ID is required");
    if (!achievementId) throw new Error("Achievement ID is required");

    const { data, error } = await supabase
      .from("user_achievements")
      .insert({
        user_id: userId,
        achievement_id: achievementId,
      })
      .select(
        `
        *,
        achievements (*)
      `
      )
      .single();

    if (error) throw error;
    return apiResponse.success(data, 201);
  } catch (error) {
    return apiResponse.error((error as Error).message);
  }
}

export const GET = withRateLimit(async (request: NextRequest) => {
  return NextResponse.json(await handleGet(request));
});

export const POST = withRateLimit(async (request: NextRequest) => {
  return NextResponse.json(await handlePost(request));
});
