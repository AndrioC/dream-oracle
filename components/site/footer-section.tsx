'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { InstagramLogoIcon } from '@radix-ui/react-icons';
import { useLocale, useTranslations } from 'next-intl';

import logoImage from '@/assets/app-icon2-no-bg.png';

const MotionDiv = dynamic<
  React.ComponentProps<typeof import('framer-motion').motion.div>
>(() => import('framer-motion').then((mod) => mod.motion.div), { ssr: false });

const footerLinks = [
  { name: 'howItWorks', href: '/#how-it-works' },
  { name: 'pricing', href: '/#pricing' },
  { name: 'faq', href: '/#faq' },
  { name: 'contact', href: '/#contact' },
];

const legalLinks = [
  { name: 'termsOfUse', href: '/terms' },
  { name: 'privacyPolicy', href: '/privacy' },
];

const socialLinks = [
  {
    name: 'Instagram',
    icon: InstagramLogoIcon,
    href: 'https://instagram.com/dreamoracle',
  },
];

export default function Footer() {
  const [isMounted, setIsMounted] = useState(false);
  const t = useTranslations('Footer');
  const locale = useLocale();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <footer className="bg-indigo-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-start">
              <div className="flex flex-col items-center">
                <Image
                  src={logoImage}
                  alt="Dream Oracle Logo"
                  width={150}
                  height={50}
                  className="mb-4"
                />
                <p className="text-purple-200 mb-4">{t('description')}</p>
              </div>
              <div className="flex space-x-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-300 hover:text-white transition duration-150 ease-in-out"
                  >
                    <link.icon className="h-6 w-6" aria-hidden="true" />
                    <span className="sr-only">{link.name}</span>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">{t('usefulLinks')}</h4>
              <ul className="space-y-2">
                {footerLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-purple-200 hover:text-white transition duration-150 ease-in-out"
                    >
                      {t(`links.${link.name}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">{t('legal')}</h4>
              <ul className="space-y-2">
                {legalLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={`/${locale}${link.href}`}
                      className="text-purple-200 hover:text-white transition duration-150 ease-in-out"
                    >
                      {t(`links.${link.name}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </MotionDiv>
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-8 pt-8 border-t border-purple-800 text-center"
        >
          <p className="text-purple-200">
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
        </MotionDiv>
      </div>
    </footer>
  );
}
