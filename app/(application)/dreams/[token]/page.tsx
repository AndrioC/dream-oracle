'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import {
  CalendarIcon,
  EyeIcon,
  EyeOffIcon,
  BookOpenIcon,
  BrainIcon,
  ImageIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { ptBR } from 'date-fns/locale';
import { imageTypes } from '@/utils/image-types';

interface Dream {
  id: string;
  title: string;
  date: string;
  description: string;
  isPublic: boolean;
  interpretation?: string;
  imageUrl?: string;
  imageStyle?: string;
}

const fetchDream = async (token: string): Promise<Dream> => {
  const { data } = await axios.get(`/api/dreams/${token}/load-dream-by-token`);
  return data;
};

export default function DreamPage({ params }: { params: { token: string } }) {
  const {
    data: dream,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['dream', params.token],
    queryFn: () => fetchDream(params.token),
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage />;
  if (!dream) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <Card className="mb-8 overflow-hidden">
          <CardHeader className="bg-blue-500 text-white">
            <CardTitle className="text-3xl sm:text-4xl font-bold mb-4">
              {dream.title}
            </CardTitle>
            <div className="flex flex-wrap items-center space-x-4">
              <Badge
                variant="secondary"
                className="flex items-center space-x-1"
              >
                <CalendarIcon className="w-4 h-4" />
                <span>{formatDate(dream.date)}</span>
              </Badge>
              <Badge
                variant="secondary"
                className="flex items-center space-x-1"
              >
                {dream.isPublic ? (
                  <EyeIcon className="w-4 h-4" />
                ) : (
                  <EyeOffIcon className="w-4 h-4" />
                )}
                <span>{dream.isPublic ? 'Público' : 'Privado'}</span>
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center">
                  <BookOpenIcon className="w-6 h-6 mr-2 text-blue-500" />
                  Descrição do Sonho
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {dream.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {(dream.interpretation || dream.imageUrl) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-indigo-50">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-indigo-800 flex items-center">
                    {dream.interpretation && dream.imageUrl ? (
                      <>
                        <BrainIcon className="w-6 h-6 mr-2 text-indigo-600" />
                        Interpretação e Imagem do Sonho
                      </>
                    ) : dream.interpretation ? (
                      <>
                        <BrainIcon className="w-6 h-6 mr-2 text-indigo-600" />
                        Interpretação do Sonho
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-6 h-6 mr-2 text-indigo-600" />
                        Imagem do Sonho
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {dream.interpretation && (
                    <div>
                      <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                        Interpretação:
                      </h3>
                      <p className="text-indigo-700 leading-relaxed">
                        {dream.interpretation}
                      </p>
                    </div>
                  )}
                  {dream.imageUrl && (
                    <div className="flex flex-col items-center">
                      <div className="flex flex-col items-center space-y-4 w-full max-w-3xl">
                        {dream.imageStyle && (
                          <Badge
                            variant="secondary"
                            className="text-sm px-3 py-1 bg-indigo-100 text-indigo-800 border border-indigo-300 rounded-full self-start"
                          >
                            Estilo:{' '}
                            {
                              imageTypes[
                                dream.imageStyle as keyof typeof imageTypes
                              ]
                            }
                          </Badge>
                        )}
                        <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-lg">
                          <Image
                            src={dream.imageUrl}
                            alt="Imagem representativa do sonho"
                            layout="fill"
                            objectFit="contain"
                            className="transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="mb-8">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
        </Card>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/3 mb-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/3 mb-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full rounded-lg" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ErrorMessage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              Erro!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">
              Ocorreu um erro ao carregar o sonho. Por favor, tente novamente
              mais tarde.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function formatDate(dateString: string): string {
  const date = parseISO(dateString);
  const zonedDate = toZonedTime(date, 'America/Sao_Paulo');
  return format(zonedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
}
