import { supabase } from "@/lib/supabase";
import { apiResponse } from "@/lib/utils/api-response";
import {
  CreateStudySessionRequest,
  UpdateStudySessionRequest,
} from "@/types/api/requests";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const planId = searchParams.get("planId");

    if (!planId) throw new Error("Plan ID is required");

    const { data, error } = await supabase
      .from("study_sessions")
      .select("*")
      .eq("study_plan_id", planId);

    if (error) throw error;
    return apiResponse.success(data);
  } catch (error) {
    return apiResponse.error((error as Error).message);
  }
}

export async function POST(request: Request) {
  try {
    const body: CreateStudySessionRequest = await request.json();

    const { data, error } = await supabase
      .from("study_sessions")
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return apiResponse.success(data, 201);
  } catch (error) {
    return apiResponse.error((error as Error).message);
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    if (!sessionId) throw new Error("Session ID is required");

    const body: UpdateStudySessionRequest = await request.json();

    const { data, error } = await supabase
      .from("study_sessions")
      .update(body)
      .eq("id", sessionId)
      .select()
      .single();

    if (error) throw error;
    return apiResponse.success(data);
  } catch (error) {
    return apiResponse.error((error as Error).message);
  }
}
