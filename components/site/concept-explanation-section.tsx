'use client';

import { motion } from 'framer-motion';
import { Brain, Image, MessageSquare } from 'lucide-react';

const features = [
  {
    icon: MessageSquare,
    title: 'Descreva seu sonho',
    description:
      'Compartilhe os detalhes do seu sonho em nossa plataforma intuitiva.',
  },
  {
    icon: Brain,
    title: 'IA interpreta',
    description:
      'Nossa IA avançada analisa seu sonho e fornece insights profundos.',
  },
  {
    icon: Image,
    title: 'Gera imagem única',
    description:
      'Visualize seu sonho com uma imagem gerada exclusivamente para você.',
  },
];

export default function ConceptExplanation() {
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
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Como funciona o Dream Oracle
          </h2>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Descubra o significado oculto dos seus sonhos com nossa tecnologia
            de ponta que combina IA e criatividade visual.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-center hover:bg-white/20 transition-colors duration-300"
            >
              <feature.icon className="w-12 h-12 mx-auto mb-4 text-purple-300" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-purple-200">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
