'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const MotionDiv = dynamic<React.ComponentProps<typeof motion.div>>(
  () => import('framer-motion').then((mod) => mod.motion.div),
  { ssr: false }
);

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  toggleOpen: () => void;
}

function FAQItem({ question, answer, isOpen, toggleOpen }: FAQItemProps) {
  return (
    <div className="border-b border-purple-700">
      <button
        className="flex justify-between items-center w-full py-4 text-left"
        onClick={toggleOpen}
      >
        <span className="text-lg font-semibold">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-6 h-6 text-purple-300" />
        ) : (
          <ChevronDown className="w-6 h-6 text-purple-300" />
        )}
      </button>
      <MotionDiv
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="pb-4 text-purple-200">{answer}</p>
      </MotionDiv>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const t = useTranslations('FAQSection');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const faqs = Array.from({ length: 6 }, (_, i) => ({
    question: t(`faqs.${i}.question`),
    answer: t(`faqs.${i}.answer`),
  }));

  return (
    <section
      className="py-16 bg-gradient-to-b from-indigo-900 to-purple-900 text-white"
      id="faq"
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

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <MotionDiv
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <FAQItem
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                toggleOpen={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              />
            </MotionDiv>
          ))}
        </div>

        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-purple-200 mb-4">{t('moreQuestions')}</p>
          <a
            href="#contact"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-900 bg-purple-300 hover:bg-purple-200 transition duration-150 ease-in-out"
          >
            {t('contactButton')}
          </a>
        </MotionDiv>
      </div>
    </section>
  );
}
