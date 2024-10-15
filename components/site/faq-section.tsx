'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const MotionDiv = dynamic<React.ComponentProps<typeof motion.div>>(
  () => import('framer-motion').then((mod) => mod.motion.div),
  { ssr: false }
);

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: 'Como funciona a interpretação de sonhos por IA?',
    answer:
      'Nossa IA analisa os detalhes do seu sonho, identificando símbolos, temas e padrões. Utilizando seu vasto conhecimento em interpretação de sonhos e psicologia, ela fornece insights personalizados baseados nas informações que você compartilha.',
  },
  {
    question: 'As imagens geradas são únicas para cada sonho?',
    answer:
      'Sim, cada imagem é gerada exclusivamente com base nos detalhes específicos do seu sonho. Nossa IA cria uma representação visual única que captura os elementos mais significativos da sua experiência onírica.',
  },
  {
    question:
      'Quanto tempo leva para receber a interpretação e a imagem do meu sonho?',
    answer:
      'Normalmente, você receberá sua interpretação e imagem em poucos minutos após submeter os detalhes do seu sonho. O tempo exato pode variar dependendo da complexidade do sonho e do volume de solicitações.',
  },
  {
    question: 'Os créditos expiram?',
    answer:
      'Não, os créditos que você compra não expiram. Você pode usá-los a qualquer momento, sem prazo de validade.',
  },
  {
    question:
      'Posso compartilhar minhas interpretações e imagens com outras pessoas?',
    answer:
      'Sim, você pode compartilhar suas interpretações e imagens. No entanto, recomendamos que você mantenha os detalhes pessoais do seu sonho privados, a menos que se sinta confortável em compartilhá-los.',
  },
  {
    question: 'A IA substitui a interpretação humana dos sonhos?',
    answer:
      'Nossa IA é uma ferramenta poderosa para obter insights sobre seus sonhos, mas não substitui completamente a interpretação humana. Ela oferece uma perspectiva adicional que pode complementar outras formas de análise de sonhos.',
  },
];

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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

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
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Encontre respostas para as dúvidas mais comuns sobre o Dream Oracle
            e como ele pode ajudar na interpretação dos seus sonhos.
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
          <p className="text-purple-200 mb-4">
            Ainda tem dúvidas? Estamos aqui para ajudar!
          </p>
          <a
            href="#contact"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-900 bg-purple-300 hover:bg-purple-200 transition duration-150 ease-in-out"
          >
            Entre em contato
          </a>
        </MotionDiv>
      </div>
    </section>
  );
}
