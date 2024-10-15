'use client';

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import dynamic from 'next/dynamic';

const MotionDiv = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.div),
  { ssr: false }
);

const pricingPlans = [
  {
    name: 'Pacote Básico',
    credits: 20,
    price: '9,99',
    features: [
      '10 interpretações de sonhos',
      '10 imagens geradas',
      'Acesso à comunidade de sonhadores',
    ],
  },
  {
    name: 'Pacote Padrão',
    credits: 100,
    price: '39,99',
    features: [
      '50 interpretações de sonhos',
      '50 imagens geradas',
      'Acesso à comunidade de sonhadores',
    ],
  },
  {
    name: 'Pacote Premium',
    credits: 200,
    price: '69,99',
    features: [
      '100 interpretações de sonhos',
      '100 imagens geradas',
      'Acesso à comunidade de sonhadores',
    ],
  },
];

export default function PricingPlans() {
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
      id="pricing"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Planos e Preços
          </h2>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto mb-4">
            Escolha o pacote de créditos que melhor se adapta às suas
            necessidades. Pague uma vez e use seus créditos quando quiser.
          </p>
          <p className="text-lg text-purple-200 max-w-2xl mx-auto">
            Cada interpretação de sonho custa 1 crédito, e cada imagem gerada
            custa 1 crédito adicional.
          </p>
        </MotionDiv>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <MotionDiv
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                <div className="text-4xl font-bold mb-4">R$ {plan.price}</div>
                <p className="text-purple-200 mb-6">
                  {plan.credits} créditos (equivalente a {plan.credits / 2}{' '}
                  sonhos completos)
                </p>
                <ul className="mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center mb-2">
                      <Check className="w-5 h-5 mr-2 text-green-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-purple-300 mt-2">
                  Os créditos não expiram e podem ser usados a qualquer momento.
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
          <p className="text-purple-200 mb-4">
            Não tem certeza de quantos créditos precisa? Comece com o Pacote
            Básico e compre mais créditos conforme necessário.
          </p>
        </MotionDiv>
      </div>
    </section>
  );
}
