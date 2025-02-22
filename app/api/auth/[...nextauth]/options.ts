import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUserDetailsByEmail, verifyUserPassword } from "@/lib/actions";
import jwt from "jsonwebtoken";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }
        try {
          const users = await getUserDetailsByEmail(credentials.email!);
          const user = users[0];

          if (!user) {
            throw new Error("User not found");
          }
          const isPasswordCorrect = await verifyUserPassword(
            user,
            credentials.password
          );

          if (!isPasswordCorrect) {
            throw new Error("Invalid credentials");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name
          };
        } catch (error) {
          console.log("Authentication error:", error);
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 1000,
  },
  jwt: {
    encode: async ({ secret, token }) => {
      const encodedToken = jwt.sign(token!, secret);
      return encodedToken;
    },
    decode: async ({ token, secret }) => {
      const decodedToken = jwt.verify(token!, secret) as jwt.JwtPayload & {
        id: string;
        email: string;
        name: string;
      };
      return decodedToken;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      if (account && user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          name: user.name,
        };
      } else if (trigger === "update") {
        return {
          ...token,
          orgId: session.orgId || token.orgId,
          orgName: session.orgName || token.orgName
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          email: token.email,
          name: token.name,
          orgId: token.orgId || null,
          orgName: token.orgName || null
        },
      };
    },
  },
};
