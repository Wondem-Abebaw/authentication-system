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
        console.log("Received Credentials:", credentials);
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
          console.log("API Response:", result);
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
      console.log("Token Before updating JWT:", token);
      if (user) {
        token.id = user.id;
        token.accesstoken = user.accesstoken;
        token.role = user.role;
      }
      console.log("After updating JWT:", token);
      return token;
    },
    async session({ session, token }) {
      console.log("Session Before:", session);
      console.log("Token:", token);
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.accesstoken = token.accesstoken;
      }
      console.log("Session After:", session);
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
