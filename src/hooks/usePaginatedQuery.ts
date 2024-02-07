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
  readonly onDataFetched?: (items: T[], isRefresh: boolean) => any;
}

export default function usePaginatedQuery<QT, T>({
  query,
  convertData,
  queryOptions,
  variables,
  onDataFetched,
}: PaginatedQueryParams<QT, T>) {
  const loadingData = useRef(true);
  const [items, setItems] = useState<T[]>([]);
  const itemsRef = useRef<T[]>([]);
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchingMore, setFetchingMore] = useState(false);

  const onCompleted = useCallback(
    (data: QT, refresh?: boolean) => {
      const convertedData = convertData(data);
      if (refresh) {
        itemsRef.current = convertedData;
      } else {
        itemsRef.current = [...itemsRef.current, ...convertedData];
      }
      onDataFetched?.(itemsRef.current, refresh ?? false);
      setTimeout(() => {
        setItems(itemsRef.current);
        loadingData.current = false;
        setLoading(false);
      }, 35);
    },
    [convertData, onDataFetched],
  );

  const onError = useCallback((receivedError: Error) => {
    setError(receivedError);
    loadingData.current = false;
  }, []);

  const { refetch: refetchData, fetchMore: fetchMoreData } = useQuery<QT>(query, {
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
    setRefreshing(true);
    const { data, error: refetchError } = await refetchData();
    await sleep(500);
    if (refetchError) {
      onError(refetchError);
    } else {
      onCompleted(data, true);
    }
    setRefreshing(false);
  }, [onCompleted, onError, refetchData]);

  const fetchMore = useCallback(async () => {
    if (loadingData.current) {
      return;
    }

    loadingData.current = true;
    setFetchingMore(true);
    const { data, error: fetchMoreError } = await fetchMoreData({
      variables: {
        offset: itemsRef.current.length,
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
