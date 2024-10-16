'use client';

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

const MotionDiv = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.div),
  { ssr: false }
);

const pricingPlans = ['basic', 'standard', 'premium'] as const;

export default function PricingPlans() {
  const [isMounted, setIsMounted] = useState(false);
  const t = useTranslations('PricingPlans');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <section
      className="py-16 bg-gradient-to-b from-purple-900 to-indigo-900 text-white"
      id="pricing"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t('title')}</h2>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto mb-4">
            {t('subtitle')}
          </p>
          <p className="text-lg text-purple-200 max-w-2xl mx-auto">
            {t('creditExplanation')}
          </p>
        </MotionDiv>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => {
            const featuresKey = `plans.${plan}.features` as const;
            const features = [
              t(`${featuresKey}.0`),
              t(`${featuresKey}.1`),
              t(`${featuresKey}.2`),
            ];
            const credits = parseInt(features[0].split(' ')[0]);
            return (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-4">
                    {t(`plans.${plan}.name`)}
                  </h3>
                  <div className="text-4xl font-bold mb-4">
                    {t(`plans.${plan}.price`)}
                  </div>
                  <p className="text-purple-200 mb-6">
                    {t('creditsExplanation', {
                      credits: credits,
                      dreams: credits / 2,
                    })}
                  </p>
                  <ul className="mb-8">
                    {features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center mb-2">
                        <Check className="w-5 h-5 mr-2 text-green-400" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-purple-300 mt-2">
                    {t('creditsValidity')}
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
          <p className="text-purple-200 mb-4">{t('notSure')}</p>
        </MotionDiv>
      </div>
    </section>
  );
}
