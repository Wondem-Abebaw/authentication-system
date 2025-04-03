import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        accesstoken: { label: "Access Token", type: "text" },
        password: { label: "PIN", type: "password" },
      },

      async authorize(credentials) {
        // console.log("Received Credentials:", credentials);
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/user/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                sourceapp: "dashportal",
                Authorization: `Bearer ${credentials.accesstoken}`,
              },
              body: JSON.stringify({ password: credentials.password }),
            }
          );

          const result = await response.json();
          // console.log("API Response:", result);
          if (response.ok && result?.data?.accesstoken) {
            return {
              id: result.data.user_id,
              name: result.data.full_name,
              email: result.data.email,
              role: result.data.user_role,
              accesstoken: result.data.accesstoken,
            };
          } else {
            throw new Error(result.message || "Login failed");
          }
        } catch (error) {
          console.error("Auth Error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accesstoken = user.accesstoken;
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.accesstoken = token.accesstoken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
});
