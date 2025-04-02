import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        user_name: { label: "User Name", type: "text" },
        pin: { label: "PIN", type: "password" },
      },
      async authorize(credentials) {
        const response = await fetch(`${API_URL}/user/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            sourceapp: "dashportal",
            Authorization: `Bearer ${credentials?.accesstoken}`,
          },
          body: JSON.stringify({ password: credentials?.pin }),
        });

        const user = await response.json();
        if (!response.ok) throw new Error("Invalid credentials");

        return { ...user, accesstoken: credentials?.accesstoken };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.accesstoken = user.accesstoken;
      return token;
    },
    async session({ session, token }) {
      session.accesstoken = token.accesstoken;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
