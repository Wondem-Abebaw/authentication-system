import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
      accesstoken: string;
    } & DefaultSession["user"];
    accesstoken: string;
  }

  interface User extends DefaultUser {
    id: string;
    role: string;
    accesstoken: string;
  }
}
