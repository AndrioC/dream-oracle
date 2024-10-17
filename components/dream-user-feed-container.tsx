'use client';

import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import DreamFeed from './dream-feed';
import { DreamsResponse } from './dream-types';
import { Card, CardContent } from './ui/card';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const fetchUserDreams = async ({ pageParam = 1 }): Promise<DreamsResponse> => {
  const { data } = await axios.get('/api/dreams/list-dreams', {
    params: { page: pageParam, limit: 10 },
  });
  return data;
};

export default function DreamUserFeedContainer() {
  const t = useTranslations('dreamFeed');
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['userDreams'],
    queryFn: fetchUserDreams,
    getNextPageParam: (lastPage) =>
      lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined,
    initialPageParam: 1,
  });

  if (isLoading) {
    return <div className="text-center">{t('loading')}</div>;
  }

  if (isError) {
    return <div className="text-center">{t('error')}</div>;
  }

  if (data?.pages[0]?.dreams.length === 0) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-center mb-2">
            {t('noDreams.title')}
          </h2>
          <p className="text-muted-foreground text-center">
            {t('noDreams.my-dream-message')}{' '}
            <Link href="/oracle" className="text-primary hover:underline">
              {t('noDreams.my-dream-share')}
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <DreamFeed
      data={data}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      isLoading={isLoading}
      isError={isError}
      refetch={refetch}
    />
  );
}
