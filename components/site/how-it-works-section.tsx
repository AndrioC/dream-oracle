'use client';

import { useEffect, useState } from 'react';
import { Edit, Brain, Image, CreditCard } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const MotionDiv = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.div),
  { ssr: false }
);

const steps = [
  {
    icon: Edit,
    title: 'Descreva seu sonho',
    description:
      'Compartilhe os detalhes do seu sonho em nossa plataforma intuitiva. Quanto mais detalhes, melhor será a interpretação.',
  },
  {
    icon: Brain,
    title: 'IA analisa o sonho',
    description:
      'Nossa inteligência artificial avançada processa as informações do seu sonho, identificando símbolos e padrões importantes.',
  },
  {
    icon: Image,
    title: 'Geração de imagem',
    description:
      'Com base na análise, nossa IA cria uma imagem única que representa visualmente os elementos-chave do seu sonho.',
  },
  {
    icon: CreditCard,
    title: 'Uso de créditos',
    description:
      'Cada interpretação e geração de imagem utiliza créditos da sua conta. Recarregue conforme necessário para continuar explorando seus sonhos.',
  },
];

export default function HowItWorks() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

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
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Como Funciona o Dream Oracle
          </h2>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Descubra o processo passo a passo de como transformamos seus sonhos
            em insights valiosos e imagens únicas.
          </p>
        </MotionDiv>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {steps.map((step, index) => (
            <MotionDiv
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="flex items-start space-x-4"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-purple-700 flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-purple-200" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-purple-200">{step.description}</p>
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
            href="/login"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-900 bg-purple-300 hover:bg-purple-200 transition duration-150 ease-in-out"
          >
            Experimente agora
          </Link>
        </MotionDiv>
      </div>
    </section>
  );
}
