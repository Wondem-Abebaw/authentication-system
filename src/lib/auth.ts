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
        try {
          const user = {
            id: "1",
            name: "J Smith",
            email: "jsmith@example.com",
          };
          if (user) {
            // Any object returned will be saved in `user` property of the JWT
            return user;
          } else {
            // If you return null then an error will be displayed advising the user to check their details.
            return null;

            // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
          }
          //   const response = await fetch(
          //     `${process.env.NEXT_PUBLIC_API_URL}/user/login`,
          //     {
          //       method: "POST",
          //       headers: {
          //         "Content-Type": "application/json",
          //         sourceapp: "dashportal",
          //         Authorization: `Bearer ${credentials.accesstoken}`,
          //       },
          //       body: JSON.stringify({ password: credentials.password }),
          //     }
          //   );

          //   const result = await response.json();
          //   console.log("result", result);
          //   if (response.ok && result?.data?.accesstoken) {
          //     return {
          //       id: result.data.user_id,
          //       name: result.data.full_name,
          //       email: result.data.email,
          //       role: result.data.user_role,
          //       accesstoken: result.data.accesstoken,
          //     };
          //   } else {
          //     throw new Error(result.message || "Login failed");
          //   }
        } catch (error) {
          console.error("Auth Error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log("token1", token);
      console.log("user", user);
      if (user) {
        token.id = user.id;
        token.accesstoken = user.accesstoken;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("session", session);
      console.log("token2", token);
      if (token) {
        session.user.id = token.id;
        session.accesstoken = token.accesstoken;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.AUTH_SECRET,
});
