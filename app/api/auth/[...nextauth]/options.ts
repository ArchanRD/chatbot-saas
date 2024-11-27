import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUserDetailsByEmail, verifyUserPassword } from "@/lib/actions";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        try {
          if (!credentials?.email) {
            throw new Error("Email or password is missing");
          }

          const users = await getUserDetailsByEmail(credentials?.email!);
          const user = users[0];

          if (!user) {
            return null;
          }
          const isPasswordCorrect = await verifyUserPassword(
            user,
            credentials?.password!
          );

          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Invalid password");
            return null;
          }
        } catch (err) {
          throw new Error("Something went wrong!");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
  },
};
