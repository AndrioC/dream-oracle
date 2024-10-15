'use client';

import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import DreamFeed from './dream-feed';
import { DreamsResponse } from './dream-types';

const fetchPublicDreams = async ({
  pageParam = 1,
}): Promise<DreamsResponse> => {
  const { data } = await axios.get('/api/dreams/list-all-public-dreams', {
    params: { page: pageParam, limit: 10 },
  });
  return data;
};

export default function DreamFeedContainer() {
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
