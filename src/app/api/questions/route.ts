import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { withRateLimit } from "@/lib/utils/with-rate-limit";
import { CreateQuestionRequest } from "@/types/api/requests";
import { NextRequest, NextResponse } from "next/server";

async function handleGet(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get("subjectId");

    const query = supabaseAdmin.from("questions").select(`
        *,
        question_alternatives (*)
      `);

    if (subjectId) {
      query.eq("subject_id", subjectId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}

async function handlePost(request: NextRequest) {
  try {
    const { alternatives, ...questionData }: CreateQuestionRequest =
      await request.json();

    const { data: question, error: questionError } = await supabaseAdmin
      .from("questions")
      .insert(questionData)
      .select()
      .single();

    if (questionError) throw questionError;

    if (alternatives && alternatives.length > 0) {
      const { error: alternativesError } = await supabaseAdmin
        .from("question_alternatives")
        .insert(
          alternatives.map((alt) => ({
            ...alt,
            question_id: question.id,
          }))
        );

      if (alternativesError) throw alternativesError;
    }

    return NextResponse.json(
      { success: true, data: question },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}

export const GET = withRateLimit(async (request: NextRequest) => {
  return NextResponse.json(await handleGet(request));
});

export const POST = withRateLimit(async (request: NextRequest) => {
  return NextResponse.json(await handlePost(request));
});
