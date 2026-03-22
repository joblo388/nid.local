import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET ?? "dev-secret-nidlocal",
  pages: {
    signIn: "/auth/connexion",
  },
  providers: [
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? [Google({
          clientId: process.env.AUTH_GOOGLE_ID,
          clientSecret: process.env.AUTH_GOOGLE_SECRET,
        })]
      : []),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Courriel", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.username ?? user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        // For Google OAuth, ensure user has a username
        if (account?.provider === "google" && user.id) {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id as string },
            select: { username: true },
          });
          if (!dbUser?.username) {
            // Generate a username from the email
            const base = (user.email ?? "user").split("@")[0].toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 20);
            let candidate = base || "user";
            let suffix = 0;
            while (await prisma.user.findFirst({ where: { username: candidate } })) {
              suffix++;
              candidate = `${base}${suffix}`;
            }
            await prisma.user.update({ where: { id: user.id as string }, data: { username: candidate } });
            token.username = candidate;
          } else {
            token.username = dbUser.username;
          }
        } else {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id as string },
            select: { username: true },
          });
          token.username = dbUser?.username ?? null;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string | null;
      }
      return session;
    },
  },
});
