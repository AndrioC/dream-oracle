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
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

import logoImage from '@/assets/app-icon2-no-bg.png';

const MotionDiv = dynamic<
  React.ComponentProps<typeof import('framer-motion').motion.div>
>(() => import('framer-motion').then((mod) => mod.motion.div), { ssr: false });

export function LoginCard() {
  const t = useTranslations('LoginCard');

  const locale = useLocale();

  return (
    <MotionDiv
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            {t('title')}
          </CardTitle>
          <CardDescription className="text-purple-200 text-lg">
            {t('description')}
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
            className="flex justify-center items-center"
          >
            <div className="rounded-full border-4 border-gray-300 shadow-lg">
              <div className="flex justify-center items-center rounded-full overflow-hidden w-[130px] h-[130px]">
                <Image
                  src={logoImage}
                  alt={t('logoAlt')}
                  width={130}
                  height={130}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </MotionDiv>
          <MotionDiv whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => signIn('google', { callbackUrl: '/feed' })}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-1"
            >
              <LogIn className="mr-2 h-5 w-5" />
              {t('loginButton')}
            </Button>
          </MotionDiv>
          <p className="text-center text-sm text-purple-200 leading-relaxed">
            {t.rich('termsAndPrivacy', {
              terms: (chunks) => (
                <Link
                  href={`/${locale}/terms`}
                  className="underline hover:text-white transition-colors duration-200"
                >
                  {chunks}
                </Link>
              ),
              privacy: (chunks) => (
                <Link
                  href={`/${locale}/privacy`}
                  className="underline hover:text-white transition-colors duration-200"
                >
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </CardContent>
      </Card>
    </MotionDiv>
  );
}
