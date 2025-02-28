"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface UserPreferences {
  studyGoal: number;
  preferredSubjects: string[];
  dailyReminders: boolean;
  theme: "light" | "dark" | "system";
}

export function useUserPreferences() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error) throw error;
      setPreferences(data);
    } catch (error) {
      console.error("Erro ao carregar preferências:", error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (
    newPreferences: Partial<UserPreferences>
  ) => {
    try {
      const { data, error } = await supabase
        .from("user_preferences")
        .upsert({
          user_id: user?.id,
          ...newPreferences,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      setPreferences(data);
      return { success: true, data };
    } catch (error) {
      console.error("Erro ao atualizar preferências:", error);
      return { success: false, error };
    }
  };

  return { preferences, loading, updatePreferences };
}
