'use client';

import { useEffect, useState } from 'react';
import { Edit, Brain, Image, CreditCard } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

const MotionDiv = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.div),
  { ssr: false }
);

const stepIcons = {
  describeYourDream: Edit,
  aiAnalyzesDream: Brain,
  imageGeneration: Image,
  creditUsage: CreditCard,
};

export default function HowItWorks() {
  const [isMounted, setIsMounted] = useState(false);
  const t = useTranslations('HowItWorks');
  const locale = useLocale();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const steps = [
    'describeYourDream',
    'aiAnalyzesDream',
    'imageGeneration',
    'creditUsage',
  ] as const;

  return (
    <section
      className="py-16 bg-gradient-to-b from-purple-900 to-indigo-900 text-white"
      id="/#how-it-works"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t('title')}</h2>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </MotionDiv>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {steps.map((step, index) => {
            const Icon = stepIcons[step];
            return (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-purple-700 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-purple-200" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {t(`steps.${step}.title`)}
                  </h3>
                  <p className="text-purple-200">
                    {t(`steps.${step}.description`)}
                  </p>
                </div>
              </MotionDiv>
            );
          })}
        </div>

        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Link
            href={`/${locale}/login`}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-900 bg-purple-300 hover:bg-purple-200 transition duration-150 ease-in-out"
          >
            {t('ctaButton')}
          </Link>
        </MotionDiv>
      </div>
    </section>
  );
}
