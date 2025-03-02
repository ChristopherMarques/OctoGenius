import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

interface UserContextType {
  user: any;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (session) {
        const email = session.user?.email;
        if (!email) {
          console.error("Email not found in session");
          return;
        }
        const { data, error } = await supabaseAdmin
          .from("users")
          .select("*")
          .eq("email", email)
          .single();

        if (error) {
          console.error("Error fetching user:", error);
        } else {
          setUser(data);
        }
      } else {
        setUser(null);
      }
    };

    fetchUser();
  }, [session]);

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
