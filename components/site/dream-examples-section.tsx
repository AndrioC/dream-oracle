'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

import dreamExample01 from '@/assets/dream01-example.png';
import dreamExample02 from '@/assets/dream02-example.png';
import dreamExample03 from '@/assets/dream03-example.png';
import Link from 'next/link';

const MotionDiv = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.div),
  { ssr: false }
);

const dreamExamples = [
  {
    title: 'Voando sobre uma cidade',
    description:
      'Eu estava voando sobre uma cidade, sentindo uma liberdade incrível. A vista panorâmica abaixo de mim me dava uma perspectiva completamente nova da paisagem urbana.',
    interpretation:
      'Você está em um momento de crescimento pessoal, capaz de superar limitações e ver as coisas de um novo ângulo. É um bom momento para estabelecer metas ambiciosas.',
    imageUrl: dreamExample01,
  },
  {
    title: 'Perseguido por sombras',
    description:
      'No meu sonho, eu estava sendo perseguido por sombras misteriosas. Não importava o quão rápido eu corria, elas pareciam sempre estar logo atrás de mim.',
    interpretation:
      'Este sonho sugere que há questões ou emoções que você precisa enfrentar. A natureza sombria dos perseguidores indica que estes aspectos podem estar no seu subconsciente.',
    imageUrl: dreamExample02,
  },
  {
    title: 'Explorando uma casa desconhecida',
    description:
      'Eu me vi explorando uma casa que eu nunca tinha visto antes. A cada porta que eu abria, descobria um novo cômodo surpreendente, cheio de objetos fascinantes.',
    interpretation:
      'Você está em um processo de autodescoberta. Cada novo cômodo representa diferentes facetas da sua personalidade ou habilidades que você está prestes a descobrir ou desenvolver.',
    imageUrl: dreamExample03,
  },
];

export default function DreamExamples() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-indigo-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Exemplos de Interpretações e Imagens
          </h2>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Explore alguns exemplos de como o Dream Oracle interpreta sonhos e
            gera imagens únicas baseadas nessas interpretações.
          </p>
        </MotionDiv>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dreamExamples.map((dream, index) => (
            <MotionDiv
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden"
            >
              <Image
                src={dream.imageUrl}
                alt={dream.title}
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{dream.title}</h3>
                <p className="text-purple-200 mb-4">{dream.description}</p>
                <h4 className="text-lg font-semibold mb-2">Interpretação:</h4>
                <p className="text-purple-200">{dream.interpretation}</p>
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
            Interprete seu sonho agora
          </Link>
        </MotionDiv>
      </div>
    </section>
  );
}
