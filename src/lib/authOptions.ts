import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { User } from "@/types/database-types";
import { showError } from "@/lib/utils/show-logs";
import { v4 as uuidv4 } from "uuid";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile https://www.googleapis.com/auth/calendar.events",
        },
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 1.5 * 60 * 60,
  },
  pages: {
    error: "/auth/error",
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) {
        showError("Usuário sem e-mail");
        return false;
      }

      const { data, error } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("email", user.email)
        .single<User>();

      if (error && error.code !== "PGRST116") {
        console.error("Erro ao buscar usuário:", error);
        return false;
      }

      if (!data) {
        const { data: newUser, error: createError } = await supabaseAdmin
          .from("users")
          .insert([
            {
              id: uuidv4(),
              email: user.email,
              full_name: user.name,
              avatar_url: user.image,
            },
          ])
          .select()
          .single<User>();

        if (createError) {
          console.error("Erro ao criar usuário:", createError);
          return false;
        }

        user.id = newUser.id;
      } else {
        user.id = data.id;
      }

      if (account && user.id) {
        const expiresAt = typeof account.expires_at === "number" ? new Date(account.expires_at * 1000).toISOString() : null;
        await supabaseAdmin
          .from("google_credentials")
          .upsert({
            user_id: user.id as string,
            access_token: (account as any).access_token ?? null,
            refresh_token: (account as any).refresh_token ?? null,
            scope: (account as any).scope ?? null,
            token_type: (account as any).token_type ?? null,
            expiry_date: expiresAt,
          });
      }

      return true;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.sub = user.id;
      }
      if (account && token.sub) {
        const expiresAt = typeof account.expires_at === "number" ? new Date(account.expires_at * 1000).toISOString() : null;
        await supabaseAdmin
          .from("google_credentials")
          .upsert({
            user_id: token.sub as string,
            access_token: (account as any).access_token ?? null,
            refresh_token: (account as any).refresh_token ?? null,
            scope: (account as any).scope ?? null,
            token_type: (account as any).token_type ?? null,
            expiry_date: expiresAt,
          });
      }
      return token;
    },
  },
};
