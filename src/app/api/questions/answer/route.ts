import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { withRateLimit } from "@/lib/utils/with-rate-limit";
import { SubmitAnswerRequest } from "@/types/api/requests";
import { NextRequest, NextResponse } from "next/server";

async function handlePost(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) throw new Error("User ID is required");

    const body: SubmitAnswerRequest = await request.json();

    // Get the correct answer
    const { data: question, error: questionError } = await supabaseAdmin
      .from("questions")
      .select(
        `
        *,
        question_alternatives (*)
      `
      )
      .eq("id", body.questionId)
      .single();

    if (questionError) throw questionError;

    let isCorrect = false;
    if (question.question_type === "multiple_choice") {
      const correctAlternative = question.question_alternatives.find(
        (alt: any) => alt.is_correct
      );
      isCorrect = correctAlternative?.id === body.selectedAlternativeId;
    }

    // Save the answer
    const { data: answer, error: answerError } = await supabaseAdmin
      .from("user_answers")
      .insert({
        user_id: userId,
        question_id: body.questionId,
        selected_alternative_id: body.selectedAlternativeId,
        essay_answer: body.essayAnswer,
        is_correct: isCorrect,
        time_spent_seconds: body.timeSpentSeconds,
      })
      .select()
      .single();

    if (answerError) throw answerError;

    // Update progress
    const { data: subject, error: subjectError } = await supabaseAdmin
      .from("subjects")
      .select("id")
      .eq("id", question.subject_id)
      .single();

    if (subjectError) throw subjectError;

    const { error: progressError } = await supabaseAdmin
      .from("subject_progress")
      .upsert(
        {
          user_id: userId,
          subject_id: subject.id,
          questions_answered: 1,
          correct_answers: isCorrect ? 1 : 0,
          last_reviewed_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,subject_id",
          count: "exact",
        }
      );

    if (progressError) throw progressError;

    return NextResponse.json({ success: true, data: answer }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}

export const POST = withRateLimit(
  async (request: NextRequest) => {
    return NextResponse.json(await handlePost(request));
  },
  {
    identifier: (request) =>
      `${request.headers.get("x-forwarded-for")}:answer:${new URL(
        request.url
      ).searchParams.get("userId")}`,
  }
);
