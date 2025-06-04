import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";
import { createUserFromGoogleAuth } from "@/lib/actions";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
    async jwt({ token, user, account, trigger, session }): Promise<JWT> {
      // Initial sign in with Google
      if (account && user) {
        // Create or update user in database
        if (account.provider === 'google' && user.email) {
          await createUserFromGoogleAuth(
            user.email,
            user.name || '',
            account.providerAccountId,
            user.image || undefined
          );
        }
        
        return {
          ...token,
          id: account.providerAccountId, // Use Google ID directly as the user ID
          email: user.email || token.email || '',
          name: user.name || token.name || '',
          picture: user.image || null,
        };
      } else if (trigger === "update" && session) {
        // Update session data
        return {
          ...token,
          orgId: session.orgId || token.orgId,
          orgName: session.orgName || token.orgName,
          chatbotId: session.chatbotId || token.chatbotId,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id || token.sub,
          email: token.email,
          name: token.name,
          image: token.picture,
          orgId: token.orgId || null,
          orgName: token.orgName || null,
          chatbotId: token.chatbotId || null,
        },
      };
    },
  },
};
