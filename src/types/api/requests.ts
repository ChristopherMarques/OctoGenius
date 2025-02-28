import { Database } from "@/database/types/database.types";

type Tables = Database["public"]["Tables"];

export interface CreateUserRequest
  extends Omit<Tables["users"]["Insert"], "id" | "created_at" | "updated_at"> {}
export interface UpdateUserRequest extends Partial<CreateUserRequest> {}

export interface CreateStudyPlanRequest
  extends Omit<
    Tables["study_plans"]["Insert"],
    "id" | "created_at" | "updated_at"
  > {}
export interface UpdateStudyPlanRequest
  extends Partial<CreateStudyPlanRequest> {}

export interface CreateStudySessionRequest
  extends Omit<Tables["study_sessions"]["Insert"], "id"> {}
export interface UpdateStudySessionRequest
  extends Partial<CreateStudySessionRequest> {}

export interface CreateQuestionRequest
  extends Omit<Tables["questions"]["Insert"], "id" | "created_at"> {
  alternatives?: Omit<
    Tables["question_alternatives"]["Insert"],
    "id" | "question_id"
  >[];
}

export interface SubmitAnswerRequest {
  questionId: string;
  selectedAlternativeId?: string;
  essayAnswer?: string;
  timeSpentSeconds: number;
}

export interface UpdateProgressRequest {
  subjectId: string;
  masteryLevel: number;
  questionsAnswered?: number;
  correctAnswers?: number;
}
