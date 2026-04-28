import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import { classifyEmail, type Role } from "@/lib/access";

declare module "next-auth" {
  interface Session {
    user: {
      role?: Role;
    } & DefaultSession["user"];
  }
}

const isProd = process.env.NODE_ENV === "production";

const providers = [];

if (process.env.AUTH_MICROSOFT_ENTRA_ID_ID && process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET) {
  providers.push(
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      issuer:
        process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER ??
        "https://login.microsoftonline.com/common/v2.0",
    })
  );
}

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    })
  );
}

if (!isProd) {
  providers.push(
    Credentials({
      id: "dev-credentials",
      name: "Dev Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const expectedUser = process.env.DEV_LOGIN_USERNAME ?? "julian";
        const expectedPass = process.env.DEV_LOGIN_PASSWORD ?? "letmein";
        if (
          credentials?.username === expectedUser &&
          credentials?.password === expectedPass
        ) {
          return {
            id: "dev-julian",
            name: "Julian (dev)",
            email: "julian@julianwiley.com",
            image: "/images/author/julian.svg",
            role: "admin",
          } as { id: string; name: string; email: string; image: string; role: "admin" };
        }
        return null;
      },
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      // First sign-in: derive the role from the user record. Credentials
      // already carries `role: "admin"`; OIDC users are classified by their
      // email against ADMIN_EMAILS / EDITOR_EMAILS env-var allow-lists.
      if (user) {
        const explicit = (user as { role?: Role }).role;
        const fromEmail = classifyEmail(user.email ?? null);
        (token as { role?: Role }).role = explicit ?? fromEmail;
      }
      return token;
    },
    async session({ session, token }) {
      const role = (token as { role?: Role }).role;
      if (session.user) {
        session.user.role = role ?? "viewer";
      }
      return session;
    },
  },
});
