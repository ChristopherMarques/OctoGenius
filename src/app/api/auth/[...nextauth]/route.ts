import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { User } from "@/types/database-types";
import { showError } from "@/lib/utils/show-logs";
import { v4 as uuidv4 } from "uuid";

const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  pages: {
    error: "/auth/error",
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) {
        showError("Usuário sem e-mail");
        return false;
      }

      // Busca o usuário pelo e-mail
      const { data, error } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("email", user.email)
        .single<User>();

      if (error && error.code !== "PGRST116") {
        console.error("Erro ao buscar usuário:", error);
        return false;
      }

      // Se o usuário não existir, cria um novo
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

      return true;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
