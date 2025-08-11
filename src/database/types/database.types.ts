export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          school: string | null;
          target_exam: string[] | null;
          study_goal: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          avatar_url?: string | null;
          school?: string | null;
          target_exam?: string[] | null;
          study_goal?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string | null;
          school?: string | null;
          target_exam?: string[] | null;
          study_goal?: string | null;
          updated_at?: string;
        };
      };
      knowledge_areas: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          parent_area_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          parent_area_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          parent_area_id?: string | null;
        };
      };
      subjects: {
        Row: {
          id: string;
          knowledge_area_id: string;
          name: string;
          description: string | null;
          difficulty_level: number;
          estimated_time_minutes: number | null;
          prerequisites: string[] | null;
        };
        Insert: {
          id?: string;
          knowledge_area_id: string;
          name: string;
          description?: string | null;
          difficulty_level: number;
          estimated_time_minutes?: number | null;
          prerequisites?: string[] | null;
        };
        Update: {
          id?: string;
          knowledge_area_id?: string;
          name?: string;
          description?: string | null;
          difficulty_level?: number;
          estimated_time_minutes?: number | null;
          prerequisites?: string[] | null;
        };
      };
      questions: {
        Row: {
          id: string;
          subject_id: string;
          content: string;
          explanation: string | null;
          difficulty_level: number;
          question_type: "multiple_choice" | "true_false" | "essay";
          source: string | null;
          year: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          subject_id: string;
          content: string;
          explanation?: string | null;
          difficulty_level: number;
          question_type: "multiple_choice" | "true_false" | "essay";
          source?: string | null;
          year?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          subject_id?: string;
          content?: string;
          explanation?: string | null;
          difficulty_level?: number;
          question_type?: "multiple_choice" | "true_false" | "essay";
          source?: string | null;
          year?: number | null;
        };
      };
      question_alternatives: {
        Row: {
          id: string;
          question_id: string;
          content: string;
          is_correct: boolean;
          explanation: string | null;
        };
        Insert: {
          id?: string;
          question_id: string;
          content: string;
          is_correct: boolean;
          explanation?: string | null;
        };
        Update: {
          id?: string;
          question_id?: string;
          content?: string;
          is_correct?: boolean;
          explanation?: string | null;
        };
      };
      diagnostic_tests: {
        Row: {
          id: string;
          user_id: string;
          knowledge_area_id: string;
          score: number | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          knowledge_area_id: string;
          score?: number | null;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          knowledge_area_id?: string;
          score?: number | null;
          completed_at?: string | null;
        };
      };
      study_plans: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          start_date: string;
          end_date: string | null;
          status: "active" | "completed" | "paused";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          start_date: string;
          end_date?: string | null;
          status: "active" | "completed" | "paused";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          start_date?: string;
          end_date?: string | null;
          status?: "active" | "completed" | "paused";
          updated_at?: string;
        };
      };
      study_sessions: {
        Row: {
          id: string;
          study_plan_id: string;
          subject_id: string;
          scheduled_date: string;
          completed_date: string | null;
          duration_minutes: number | null;
          status: "pending" | "completed" | "missed";
          performance_rating: number | null;
          topic: string | null;
          task_type: string | null;
        };
        Insert: {
          id?: string;
          study_plan_id: string;
          subject_id: string;
          scheduled_date: string;
          completed_date?: string | null;
          duration_minutes?: number | null;
          status: "pending" | "completed" | "missed";
          performance_rating?: number | null;
          topic?: string | null;
          task_type?: string | null;
        };
        Update: {
          id?: string;
          study_plan_id?: string;
          subject_id?: string;
          scheduled_date?: string;
          completed_date?: string | null;
          duration_minutes?: number | null;
          status?: "pending" | "completed" | "missed";
          performance_rating?: number | null;
          topic?: string | null;
          task_type?: string | null;
        };
      };
      user_answers: {
        Row: {
          id: string;
          user_id: string;
          question_id: string;
          selected_alternative_id: string | null;
          essay_answer: string | null;
          is_correct: boolean | null;
          time_spent_seconds: number | null;
          answered_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          question_id: string;
          selected_alternative_id?: string | null;
          essay_answer?: string | null;
          is_correct?: boolean | null;
          time_spent_seconds?: number | null;
          answered_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          question_id?: string;
          selected_alternative_id?: string | null;
          essay_answer?: string | null;
          is_correct?: boolean | null;
          time_spent_seconds?: number | null;
          answered_at?: string;
        };
      };
      subject_progress: {
        Row: {
          id: string;
          user_id: string;
          subject_id: string;
          mastery_level: number;
          questions_answered: number;
          correct_answers: number;
          last_reviewed_at: string | null;
          next_review_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subject_id: string;
          mastery_level: number;
          questions_answered?: number;
          correct_answers?: number;
          last_reviewed_at?: string | null;
          next_review_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          subject_id?: string;
          mastery_level?: number;
          questions_answered?: number;
          correct_answers?: number;
          last_reviewed_at?: string | null;
          next_review_date?: string | null;
          updated_at?: string;
        };
      };
      achievements: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon_url: string | null;
          points: number;
          achievement_type: "streak" | "mastery" | "completion" | "special";
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          icon_url?: string | null;
          points: number;
          achievement_type: "streak" | "mastery" | "completion" | "special";
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          icon_url?: string | null;
          points?: number;
          achievement_type?: "streak" | "mastery" | "completion" | "special";
        };
      };
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          achieved_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_id: string;
          achieved_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          achievement_id?: string;
          achieved_at?: string;
        };
      };
      daily_stats: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          study_time_minutes: number;
          questions_answered: number;
          correct_answers: number;
          subjects_reviewed: number;
          streak_days: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          study_time_minutes?: number;
          questions_answered?: number;
          correct_answers?: number;
          subjects_reviewed?: number;
          streak_days?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          study_time_minutes?: number;
          questions_answered?: number;
          correct_answers?: number;
          subjects_reviewed?: number;
          streak_days?: number;
        };
      };
      plans: {
        Row: {
          id: string;
          name: string;
          price: number;
          features: string[];
          stripe_price_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          price: number;
          features: string[];
          stripe_price_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          price?: number;
          features?: string[];
          stripe_price_id?: string | null;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string;
          status: "active" | "canceled" | "expired";
          stripe_subscription_id: string | null;
          payment_status: "paid" | "unpaid" | "pending" | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_id: string;
          status?: "active" | "canceled" | "expired";
          stripe_subscription_id?: string | null;
          payment_status?: "paid" | "unpaid" | "pending" | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan_id?: string;
      google_credentials: {
        Row: {
          user_id: string;
          access_token: string | null;
          refresh_token: string | null;
          scope: string | null;
          token_type: string | null;
          expiry_date: string | null;
        };
        Insert: {
          user_id: string;
          access_token?: string | null;
          refresh_token?: string | null;
          scope?: string | null;
          token_type?: string | null;
          expiry_date?: string | null;
        };
        Update: {
          user_id?: string;
          access_token?: string | null;
          refresh_token?: string | null;
          scope?: string | null;
          token_type?: string | null;
          expiry_date?: string | null;
        };
      };
          status?: "active" | "canceled" | "expired";
          stripe_subscription_id?: string | null;
          payment_status?: "paid" | "unpaid" | "pending" | null;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
