import { DocumentNode, FetchPolicy, useQuery } from '@apollo/client';
import sleep from 'lib/sleep';
import { useCallback, useRef, useState } from 'react';

interface PaginatedQueryParams<QT, T> {
  readonly query: DocumentNode;
  readonly convertData: (data?: QT) => T[];
  readonly queryOptions?: {
    readonly itemsPerPage?: number;
    readonly fetchPolicy?: FetchPolicy;
  };
  readonly variables?: Record<any, any>;
}

export default function usePaginatedQuery<QT, T>({
  query,
  convertData,
  queryOptions,
  variables,
}: PaginatedQueryParams<QT, T>) {
  const loadingData = useRef(true);
  const fetchOffsetRef = useRef(0);
  const [items, setItems] = useState<T[]>([]);
  const [error, setError] = useState<Error>();
  const [refreshing, setRefreshing] = useState(false);
  const [fetchingMore, setFetchingMore] = useState(false);

  const onCompleted = useCallback(
    (data: QT, refresh?: boolean) => {
      console.log('[APOLLO] onCompleted');
      const convertedData = convertData(data);
      setItems(old => {
        if (refresh) {
          fetchOffsetRef.current = convertedData.length;
          return convertedData;
        } else {
          const newData = [...old, ...convertedData];
          fetchOffsetRef.current = newData.length;
          return newData;
        }
      });
      loadingData.current = false;
    },
    [convertData],
  );

  const onError = useCallback((error: Error) => {
    setError(error);
    loadingData.current = false;
  }, []);

  const {
    refetch: refetchData,
    fetchMore: fetchMoreData,
    loading,
  } = useQuery<QT>(query, {
    variables: {
      ...variables,
      offset: 0,
      limit: queryOptions?.itemsPerPage ?? 20,
    },
    onCompleted,
    onError,
    fetchPolicy: queryOptions?.fetchPolicy ?? 'no-cache',
  });

  const refresh = useCallback(async () => {
    console.log('[APOLLO] refresh');
    setRefreshing(true);
    const { data, error } = await refetchData();
    await sleep(500);
    if (error) {
      onError(error);
    } else {
      onCompleted(data, true);
    }
    setRefreshing(false);
  }, [refetchData]);

  const fetchMore = useCallback(async () => {
    if (loadingData.current) {
      console.log('[APOLLO] Already loading the data');
      return;
    }
    console.log('[APOLLO] fetchMore');
    loadingData.current = true;
    setFetchingMore(true);
    const { data, error: fetchMoreError } = await fetchMoreData({
      variables: {
        offset: fetchOffsetRef.current,
      },
    });
    if (fetchMoreError) {
      onError(fetchMoreError);
    } else {
      onCompleted(data);
    }
    setFetchingMore(false);
  }, [fetchMoreData, onCompleted, onError]);

  return {
    items,
    refresh,
    refreshing,
    fetchMore,
    fetchingMore,
    loading,
    error,
  };
}
