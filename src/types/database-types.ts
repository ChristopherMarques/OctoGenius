// src/types/databaseTypes.ts

export interface User {
  id: string; // UUID
  email: string; // TEXT
  full_name: string; // TEXT
  avatar_url?: string; // TEXT
  school?: string; // TEXT
  target_exam?: string[]; // TEXT[]
  study_goal?: string; // TEXT
  created_at: string; // TIMESTAMP WITH TIME ZONE
  updated_at: string; // TIMESTAMP WITH TIME ZONE
}

export interface KnowledgeArea {
  id: string; // UUID
  name: string; // TEXT
  description?: string; // TEXT
  parent_area_id?: string; // UUID
  created_at: string; // TIMESTAMP WITH TIME ZONE
}

export interface Subject {
  id: string; // UUID
  knowledge_area_id: string; // UUID
  name: string; // TEXT
  description?: string; // TEXT
  difficulty_level?: number; // INTEGER
  estimated_time_minutes?: number; // INTEGER
  prerequisites?: string[]; // UUID[]
}

export interface Question {
  id: string; // UUID
  subject_id: string; // UUID
  content: string; // TEXT
  explanation?: string; // TEXT
  difficulty_level?: number; // INTEGER
  question_type: "multiple_choice" | "true_false" | "essay"; // TEXT
  source?: string; // TEXT
  year?: number; // INTEGER
  created_at: string; // TIMESTAMP WITH TIME ZONE
}

export interface QuestionAlternative {
  id: string; // UUID
  question_id: string; // UUID
  content: string; // TEXT
  is_correct: boolean; // BOOLEAN
  explanation?: string; // TEXT
}

export interface DiagnosticTest {
  id: string; // UUID
  user_id: string; // UUID
  knowledge_area_id: string; // UUID
  score?: number; // DECIMAL
  completed_at?: string; // TIMESTAMP WITH TIME ZONE
  created_at: string; // TIMESTAMP WITH TIME ZONE
}

export interface StudyPlan {
  id: string; // UUID
  user_id: string; // UUID
  name: string; // TEXT
  start_date: string; // DATE
  end_date?: string; // DATE
  status: "active" | "completed" | "paused"; // TEXT
  created_at: string; // TIMESTAMP WITH TIME ZONE
  updated_at: string; // TIMESTAMP WITH TIME ZONE
}

export interface StudySession {
  id: string; // UUID
  study_plan_id: string; // UUID
  subject_id: string; // UUID
  scheduled_date: string; // DATE
  completed_date?: string; // DATE
  duration_minutes?: number; // INTEGER
  status: "pending" | "completed" | "missed"; // TEXT
  performance_rating?: number; // INTEGER
}

export interface UserAnswer {
  id: string; // UUID
  user_id: string; // UUID
  question_id: string; // UUID
  selected_alternative_id?: string; // UUID
  essay_answer?: string; // TEXT
  is_correct?: boolean; // BOOLEAN
  time_spent_seconds?: number; // INTEGER
  answered_at: string; // TIMESTAMP WITH TIME ZONE
}

export interface SubjectProgress {
  id: string; // UUID
  user_id: string; // UUID
  subject_id: string; // UUID
  mastery_level?: number; // DECIMAL
  questions_answered?: number; // INTEGER
  correct_answers?: number; // INTEGER
  last_reviewed_at?: string; // TIMESTAMP WITH TIME ZONE
  next_review_date?: string; // DATE
  created_at: string; // TIMESTAMP WITH TIME ZONE
  updated_at: string; // TIMESTAMP WITH TIME ZONE
}

export interface Achievement {
  id: string; // UUID
  name: string; // TEXT
  description: string; // TEXT
  icon_url?: string; // TEXT
  points: number; // INTEGER
  achievement_type: "streak" | "mastery" | "completion" | "special"; // TEXT
}

export interface UserAchievement {
  id: string; // UUID
  user_id: string; // UUID
  achievement_id: string; // UUID
  achieved_at: string; // TIMESTAMP WITH TIME ZONE
}

export interface DailyStat {
  id: string; // UUID
  user_id: string; // UUID
  date: string; // DATE
  study_time_minutes?: number; // INTEGER
  questions_answered?: number; // INTEGER
  correct_answers?: number; // INTEGER
  subjects_reviewed?: number; // INTEGER
  streak_days?: number; // INTEGER
}

export interface Plan {
  id: string; // UUID
  name: string; // TEXT
  features: string[]; // TEXT[]
  price: number; // INTEGER
  stripe_price_id: string; // TEXT
  created_at: string; // TIMESTAMP WITH TIME ZONE
  updated_at: string; // TIMESTAMP WITH TIME ZONE
}

export interface Subscription {
  id: string; // UUID
  user_id: string; // UUID
  plan_id: string; // UUID
  stripe_subscription_id: string; // TEXT
  status: "active" | "canceled" | "expired"; // TEXT
  payment_status: "paid" | "pending" | "failed"; // TEXT
  created_at: string; // TIMESTAMP WITH TIME ZONE
  updated_at: string; // TIMESTAMP WITH TIME ZONE
}
