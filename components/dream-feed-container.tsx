'use client';

import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import DreamFeed from './dream-feed';
import { DreamsResponse } from './dream-types';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const fetchPublicDreams = async ({
  pageParam = 1,
}): Promise<DreamsResponse> => {
  const { data } = await axios.get('/api/dreams/list-all-public-dreams', {
    params: { page: pageParam, limit: 10 },
  });
  return data;
};

export default function DreamFeedContainer() {
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
    queryKey: ['publicDreams'],
    queryFn: fetchPublicDreams,
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
            {t('noDreams.message')}{' '}
            <Link href="/oracle" className="text-primary hover:underline">
              {t('noDreams.share')}
            </Link>{' '}
            {t('noDreams.yours')}
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
