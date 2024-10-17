'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import { useTheme } from 'next-themes';
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
import { enUS, ptBR } from 'date-fns/locale';
import { imageTypes } from '@/utils/image-types';
import { useTranslations } from 'next-intl';
import { UserSettings } from '@prisma/client';
import { useSession } from 'next-auth/react';

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

const fetchUserSettings = async (): Promise<UserSettings> => {
  const { data } = await axios.get('/api/users/load-settings');
  return data;
};

export default function DreamPage({ params }: { params: { token: string } }) {
  const { theme } = useTheme();
  const t = useTranslations('dreamPage');
  const { data: session } = useSession();
  const { data: userSettings, isLoading: isLoadingSettings } =
    useQuery<UserSettings>({
      queryKey: ['userSettings'],
      queryFn: fetchUserSettings,
      enabled: !!session,
    });
  const {
    data: dream,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['dream', params.token],
    queryFn: () => fetchDream(params.token),
  });

  if (isLoading || isLoadingSettings) return <LoadingSpinner />;
  if (isError) return <ErrorMessage />;
  if (!dream) return null;

  return (
    <div
      className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-blue-50 to-white'} py-12 px-4 sm:px-6 lg:px-8`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="mb-8 overflow-hidden shadow-lg">
          <CardHeader
            className={`${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-500'} text-white p-6`}
          >
            <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              {dream.title}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant="secondary"
                className={`flex items-center space-x-1 ${theme === 'dark' ? 'bg-blue-800' : 'bg-blue-200'} text-white`}
              >
                <CalendarIcon className="w-4 h-4" />
                <span>{formatDate(dream.date, userSettings?.language)}</span>
              </Badge>
              <Badge
                variant="secondary"
                className={`flex items-center space-x-1 ${theme === 'dark' ? 'bg-blue-800' : 'bg-blue-200'} text-white`}
              >
                {dream.isPublic ? (
                  <EyeIcon className="w-4 h-4" />
                ) : (
                  <EyeOffIcon className="w-4 h-4" />
                )}
                <span>{dream.isPublic ? t('public') : t('private')}</span>
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
            <Card
              className={`shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
            >
              <CardHeader>
                <CardTitle
                  className={`text-xl sm:text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} flex items-center`}
                >
                  <BookOpenIcon
                    className={`w-6 h-6 mr-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`}
                  />
                  {t('dreamDescription')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}
                >
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
              <Card
                className={`shadow-md ${theme === 'dark' ? 'bg-gray-700' : 'bg-indigo-50'}`}
              >
                <CardHeader>
                  <CardTitle
                    className={`text-xl sm:text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-indigo-800'} flex items-center`}
                  >
                    {dream.interpretation && dream.imageUrl ? (
                      <>
                        <BrainIcon
                          className={`w-6 h-6 mr-2 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}
                        />
                        {t('interpretationAndImage')}
                      </>
                    ) : dream.interpretation ? (
                      <>
                        <BrainIcon
                          className={`w-6 h-6 mr-2 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}
                        />
                        {t('dreamInterpretation')}
                      </>
                    ) : (
                      <>
                        <ImageIcon
                          className={`w-6 h-6 mr-2 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}
                        />
                        {t('dreamImage')}
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {dream.interpretation && (
                    <div>
                      <h3
                        className={`text-lg sm:text-xl font-semibold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700'} mb-2`}
                      >
                        {t('interpretation')}:
                      </h3>
                      <p
                        className={`${theme === 'dark' ? 'text-gray-300' : 'text-indigo-700'} leading-relaxed`}
                      >
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
                            className={`text-sm px-3 py-1 ${
                              theme === 'dark'
                                ? 'bg-indigo-900 text-indigo-100 border-indigo-700'
                                : 'bg-indigo-100 text-indigo-800 border-indigo-300'
                            } rounded-full self-start`}
                          >
                            {t('style')}:{' '}
                            {t(
                              `imageTypes.${dream.imageStyle as keyof typeof imageTypes}`
                            )}
                          </Badge>
                        )}
                        <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-lg">
                          <Image
                            src={dream.imageUrl}
                            alt={t('dreamImageAlt')}
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
  const { theme } = useTheme();
  return (
    <div
      className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-blue-50 to-white'} py-12 px-4 sm:px-6 lg:px-8`}
    >
      <div className="max-w-4xl mx-auto">
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
  const { theme } = useTheme();
  const t = useTranslations('dreamPage');
  return (
    <div
      className={`flex justify-center items-center min-h-screen ${theme === 'dark' ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-blue-50 to-white'}`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          className={`${theme === 'dark' ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200'}`}
        >
          <CardHeader>
            <CardTitle
              className={`${theme === 'dark' ? 'text-red-100' : 'text-red-800'} flex items-center`}
            >
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
              {t('error')}!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`${theme === 'dark' ? 'text-red-200' : 'text-red-600'}`}
            >
              {t('errorMessage')}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function formatDate(dateString: string, language?: string): string {
  const date = parseISO(dateString);
  const zonedDate = toZonedTime(date, 'America/Sao_Paulo');
  return format(zonedDate, "dd 'de' MMMM 'de' yyyy", {
    locale: language === 'en-US' ? enUS : ptBR,
  });
}
