import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  events: {
    async createUser({ user }) {
      if (user.id && typeof user.id === 'number') {
        await prisma.credit.create({
          data: {
            userId: user.id,
            amount: 2,
          },
        });

        const headersList = headers();
        const acceptLanguage = headersList.get('accept-language');
        let language = 'pt-BR';

        if (acceptLanguage) {
          const preferredLanguage = acceptLanguage.split(',')[0].toLowerCase();
          if (preferredLanguage.startsWith('en-US')) {
            language = 'en-US';
          }
        }

        await prisma.userSettings.create({
          data: {
            userId: user.id,
            language: language,
            theme: 'system',
          },
        });
      } else {
        console.error(
          'Falha ao criar créditos e configurações: user.id é inválido ou indefinido'
        );
      }
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
});
