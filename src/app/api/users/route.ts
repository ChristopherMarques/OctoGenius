import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { withRateLimit } from "@/lib/utils/with-rate-limit";
import { CreateUserRequest, UpdateUserRequest } from "@/types/api/requests";
import { NextRequest, NextResponse } from "next/server";

async function handleGet(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (userId) {
      const { data, error } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, data }, { status: 200 });
    }

    const { data, error } = await supabaseAdmin.from("users").select("*");

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
    const body: CreateUserRequest = await request.json();

    const { data, error } = await supabaseAdmin
      .from("users")
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
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const body: UpdateUserRequest = await request.json();

    const { data, error } = await supabaseAdmin
      .from("users")
      .update(body)
      .eq("id", userId)
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

export const GET = withRateLimit(handleGet);
export const POST = withRateLimit(handlePost);
export const PATCH = withRateLimit(handlePatch);
