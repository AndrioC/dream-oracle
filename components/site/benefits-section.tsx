'use client';

import { useEffect, useState } from 'react';
import { Lightbulb, Compass, Sparkles, Zap } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const MotionDiv = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.div),
  { ssr: false }
);

const benefitIcons = {
  deepSelfKnowledge: Lightbulb,
  personalGuidance: Compass,
  stimulateCreativity: Sparkles,
  problemSolving: Zap,
};

export default function BenefitsSection() {
  const [isMounted, setIsMounted] = useState(false);
  const t = useTranslations('BenefitsSection');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const benefits = [
    'deepSelfKnowledge',
    'personalGuidance',
    'stimulateCreativity',
    'problemSolving',
  ] as const;

  return (
    <section className="py-16 bg-gradient-to-b from-indigo-900 to-purple-900 text-white">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefitIcons[benefit];
            return (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-lg p-6 hover:bg-white/20 transition-colors duration-300"
              >
                <Icon className="w-12 h-12 mb-4 text-purple-300" />
                <h3 className="text-xl font-semibold mb-2">
                  {t(`benefits.${benefit}.title`)}
                </h3>
                <p className="text-purple-200">
                  {t(`benefits.${benefit}.description`)}
                </p>
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
            href="/login"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-900 bg-purple-300 hover:bg-purple-200 transition duration-150 ease-in-out"
          >
            {t('ctaButton')}
          </Link>
        </MotionDiv>
      </div>
    </section>
  );
}
