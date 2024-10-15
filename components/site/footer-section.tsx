'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { InstagramLogoIcon } from '@radix-ui/react-icons';

const MotionDiv = dynamic<
  React.ComponentProps<typeof import('framer-motion').motion.div>
>(() => import('framer-motion').then((mod) => mod.motion.div), { ssr: false });

const footerLinks = [
  { name: 'Como Funciona', href: '/#how-it-works' },
  { name: 'Preços', href: '/#pricing' },
  { name: 'FAQ', href: '/#faq' },
  { name: 'Contato', href: '/#contact' },
];

const legalLinks = [
  { name: 'Termos de Uso', href: '/terms' },
  { name: 'Política de Privacidade', href: '/privacy' },
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
            <div>
              <h3 className="text-2xl font-bold mb-4">Dream Oracle</h3>
              <p className="text-purple-200 mb-4">
                Descubra o significado dos seus sonhos com a ajuda da nossa IA
                avançada.
              </p>
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
              <h4 className="text-lg font-semibold mb-4">Links Úteis</h4>
              <ul className="space-y-2">
                {footerLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-purple-200 hover:text-white transition duration-150 ease-in-out"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                {legalLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-purple-200 hover:text-white transition duration-150 ease-in-out"
                    >
                      {link.name}
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
            &copy; {new Date().getFullYear()} Dream Oracle. Todos os direitos
            reservados.
          </p>
        </MotionDiv>
      </div>
    </footer>
  );
}
