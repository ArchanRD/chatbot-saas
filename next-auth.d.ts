import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      orgId: string;
      orgName: string;
      chatbotId: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    name: string;
    email: string;
    id: string;
  }
}
