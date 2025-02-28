import { supabase } from "@/lib/supabase";
import { apiResponse } from "@/lib/utils/api-response";
import { withRateLimit } from "@/lib/utils/with-rate-limit";
import { CreateUserRequest, UpdateUserRequest } from "@/types/api/requests";
import { NextRequest, NextResponse } from "next/server";

async function handleGet(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (userId) {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return apiResponse.success(data);
    }

    const { data, error } = await supabase.from("users").select("*");

    if (error) throw error;
    return apiResponse.success(data);
  } catch (error) {
    return apiResponse.error((error as Error).message);
  }
}

async function handlePost(request: NextRequest) {
  try {
    const body: CreateUserRequest = await request.json();

    const { data, error } = await supabase
      .from("users")
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return apiResponse.success(data, 201);
  } catch (error) {
    return apiResponse.error((error as Error).message);
  }
}

async function handlePatch(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) throw new Error("User ID is required");

    const body: UpdateUserRequest = await request.json();

    const { data, error } = await supabase
      .from("users")
      .update(body)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return apiResponse.success(data);
  } catch (error) {
    return apiResponse.error((error as Error).message);
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
