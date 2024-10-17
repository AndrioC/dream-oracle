'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

import bgImage from '@/assets/bg.png';

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const t = useTranslations('HeroSection');
  const locale = useLocale();

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-indigo-900 to-purple-900 text-white px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0">
        <Image
          src={bgImage}
          alt={t('imageAlt')}
          layout="fill"
          objectFit="cover"
          quality={100}
          className="opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/70 via-purple-900/60 to-indigo-900/70"></div>
      </div>

      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1) 0%, transparent 15%)`,
        }}
      />
      <motion.div
        className="relative z-10 text-center max-w-4xl mx-auto mt-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 text-white text-shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {t('title')}
        </motion.h1>
        <motion.p
          className="text-xl sm:text-2xl md:text-3xl mb-10 text-purple-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {t('subtitle')}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <Link
            href={`/${locale}/login`}
            className="inline-flex items-center px-8 py-4 border-2 border-purple-300 text-lg font-medium rounded-full text-white bg-purple-600 hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            {t('ctaButton')}
            <Sparkles className="ml-2 -mr-1 h-5 w-5" />
          </Link>
        </motion.div>
      </motion.div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-900 to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-indigo-900 to-transparent" />
    </section>
  );
}
