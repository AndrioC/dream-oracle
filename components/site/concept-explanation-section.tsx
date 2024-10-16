'use client';

import { motion } from 'framer-motion';
import { Brain, Image, MessageSquare } from 'lucide-react';
import { useTranslations } from 'next-intl';

const featureIcons = {
  describeYourDream: MessageSquare,
  aiInterprets: Brain,
  generatesUniqueImage: Image,
};

export default function ConceptExplanation() {
  const t = useTranslations('ConceptExplanation');

  const features = [
    'describeYourDream',
    'aiInterprets',
    'generatesUniqueImage',
  ] as const;

  return (
    <section className="py-16 bg-gradient-to-b from-purple-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t('title')}</h2>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = featureIcons[feature];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-center hover:bg-white/20 transition-colors duration-300"
              >
                <Icon className="w-12 h-12 mx-auto mb-4 text-purple-300" />
                <h3 className="text-xl font-semibold mb-2">
                  {t(`features.${feature}.title`)}
                </h3>
                <p className="text-purple-200">
                  {t(`features.${feature}.description`)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
