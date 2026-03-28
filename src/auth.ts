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
    async jwt({ token, user, account, trigger }) {
      if (user) {
        token.id = user.id;
        // For Google OAuth, ensure user exists in DB and has a username
        if (account?.provider === "google" && user.email) {
          let dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            select: { id: true, username: true },
          });

          // Create user if doesn't exist
          if (!dbUser) {
            const base = (user.email).split("@")[0].toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 20);
            let candidate = base || "user";
            let suffix = 0;
            while (await prisma.user.findFirst({ where: { username: candidate } })) {
              suffix++;
              candidate = `${base}${suffix}`;
            }
            dbUser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name ?? candidate,
                username: candidate,
                image: user.image ?? null,
              },
              select: { id: true, username: true },
            });
          } else {
            // Update photo from Google on every login
            if (user.image) {
              await prisma.user.update({ where: { id: dbUser.id }, data: { image: user.image } });
            }
            if (!dbUser.username) {
              const base = (user.email).split("@")[0].toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 20);
              let candidate = base || "user";
              let suffix = 0;
              while (await prisma.user.findFirst({ where: { username: candidate } })) {
                suffix++;
                candidate = `${base}${suffix}`;
              }
              await prisma.user.update({ where: { id: dbUser.id }, data: { username: candidate } });
              dbUser.username = candidate;
            }
          }

          token.id = dbUser.id;
          token.username = dbUser.username;
        } else if (user) {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id as string },
            select: { username: true },
          });
          token.username = dbUser?.username ?? null;
        }
      }
      // Rafraîchir l'username depuis la DB si manquant ou sur demande explicite (update())
      if ((trigger === "update" || token.username == null) && token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { username: true },
        });
        token.username = dbUser?.username ?? null;
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
