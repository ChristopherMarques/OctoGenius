import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import type { Database } from "@/database/types/database.types";

export function useAuth() {
  const router = useRouter();
  const supabase = useSupabaseClient<Database>();
  const user = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const syncUserData = async (sessionUser: any) => {
      try {
        const { data: existingUser, error: fetchError } = await supabase
          .from("users")
          .select()
          .eq("id", sessionUser.id)
          .single();

        const userData = {
          id: sessionUser.id,
          email: sessionUser.email,
          full_name:
            sessionUser.user_metadata?.full_name ||
            sessionUser.user_metadata?.name ||
            "Unknown",
          avatar_url:
            sessionUser.user_metadata?.avatar_url ||
            sessionUser.user_metadata?.picture,
          updated_at: new Date().toISOString(),
        };

        if (!existingUser) {
          await supabase.from("users").insert([userData]);
        } else {
          await supabase
            .from("users")
            .update(userData)
            .eq("id", sessionUser.id);
        }
      } catch (error) {
        console.error("Error syncing user data:", error);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsLoading(true);

      if (session?.user) {
        await syncUserData(session.user);
      }

      if (event === "SIGNED_IN") {
        router.refresh();
      }
      if (event === "SIGNED_OUT") {
        router.push("/");
      }

      setIsLoading(false);
    });

    // Initial sync
    if (user) {
      syncUserData(user).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router, user]);

  return { user, isLoading };
}
