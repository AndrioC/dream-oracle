'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

import dreamExample01 from '@/assets/dream01-example.png';
import dreamExample02 from '@/assets/dream02-example.png';
import dreamExample03 from '@/assets/dream03-example.png';

const MotionDiv = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.div),
  { ssr: false }
);

const dreamExampleImages = {
  flyingOverCity: dreamExample01,
  chasedByShadows: dreamExample02,
  exploringUnknownHouse: dreamExample03,
};

export default function DreamExamples() {
  const [isMounted, setIsMounted] = useState(false);
  const t = useTranslations('DreamExamples');
  const locale = useLocale();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const dreamExamples = [
    'flyingOverCity',
    'chasedByShadows',
    'exploringUnknownHouse',
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dreamExamples.map((dream, index) => (
            <MotionDiv
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden"
            >
              <Image
                src={dreamExampleImages[dream]}
                alt={t(`examples.${dream}.title`)}
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  {t(`examples.${dream}.title`)}
                </h3>
                <p className="text-purple-200 mb-4">
                  {t(`examples.${dream}.description`)}
                </p>
                <h4 className="text-lg font-semibold mb-2">
                  {t('interpretationLabel')}
                </h4>
                <p className="text-purple-200">
                  {t(`examples.${dream}.interpretation`)}
                </p>
              </div>
            </MotionDiv>
          ))}
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
