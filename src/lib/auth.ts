import NextAuth from "next-auth";
import type { DefaultSession, NextAuthConfig } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      name?: string | null;
    };
  }
}

export const authConfig = {
  providers: [
    {
      id: "credentials",
      name: "Credentials",
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        // Replace with your actual authentication logic
        // This is just a mock implementation
        return {
          id: '1',
          email: credentials.email as string,
          name: 'User',
        };
      }
    }
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
} satisfies NextAuthConfig;

const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export { handlers as GET, handlers as POST, auth, signIn, signOut };

// Helper function to get the auth session
export const getAuthSession = async () => {
  return await auth();
};
