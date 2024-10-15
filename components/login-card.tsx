'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LogIn } from 'lucide-react';
import { signIn } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const MotionDiv = dynamic<
  React.ComponentProps<typeof import('framer-motion').motion.div>
>(() => import('framer-motion').then((mod) => mod.motion.div), { ssr: false });

export function LoginCard() {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Bem-vindo ao Dream Oracle
          </CardTitle>
          <CardDescription className="text-purple-200 text-lg">
            Desvende os mistérios dos seus sonhos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <MotionDiv
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.2,
              type: 'spring',
              stiffness: 260,
              damping: 20,
            }}
            className="flex justify-center"
          >
            <Image
              src="/placeholder.svg?height=120&width=120"
              alt="Dream Oracle Logo"
              width={120}
              height={120}
              className="rounded-full border-4 border-white/30 shadow-lg"
            />
          </MotionDiv>
          <MotionDiv whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => signIn('google', { callbackUrl: '/feed' })}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-1"
            >
              <LogIn className="mr-2 h-5 w-5" />
              Entrar com Google
            </Button>
          </MotionDiv>
          <p className="text-center text-sm text-purple-200 leading-relaxed">
            Ao fazer login, você concorda com nossos{' '}
            <a
              href="/terms"
              className="underline hover:text-white transition-colors duration-200"
            >
              Termos de Uso
            </a>{' '}
            e{' '}
            <a
              href="/privacy"
              className="underline hover:text-white transition-colors duration-200"
            >
              Política de Privacidade
            </a>
            .
          </p>
        </CardContent>
      </Card>
    </MotionDiv>
  );
}
