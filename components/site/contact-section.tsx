'use client';

import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

const MotionDiv = dynamic<
  React.ComponentProps<typeof import('framer-motion').motion.div>
>(() => import('framer-motion').then((mod) => mod.motion.div), { ssr: false });

export default function ContactSection() {
  const [isMounted, setIsMounted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const t = useTranslations('ContactSection');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', { name, email, message });
    setName('');
    setEmail('');
    setMessage('');
  };

  if (!isMounted) {
    return null;
  }

  return (
    <section
      className="py-16 bg-gradient-to-b from-purple-900 to-indigo-900 text-white"
      id="contact"
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

        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-lg mx-auto"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-purple-200"
              >
                {t('form.name.label')}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-white/10 border border-purple-300 rounded-md text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder={t('form.name.placeholder')}
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-purple-200"
              >
                {t('form.email.label')}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-white/10 border border-purple-300 rounded-md text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder={t('form.email.placeholder')}
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-purple-200"
              >
                {t('form.message.label')}
              </label>
              <textarea
                id="message"
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                className="mt-1 block w-full px-3 py-2 bg-white/10 border border-purple-300 rounded-md text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder={t('form.message.placeholder')}
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-900 bg-purple-300 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out"
              >
                {t('form.submit')}
                <Send className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </form>
        </MotionDiv>
      </div>
    </section>
  );
}
