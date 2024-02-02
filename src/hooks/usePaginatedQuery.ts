import { DocumentNode, FetchPolicy, useQuery } from '@apollo/client';
import { useCallback, useRef, useState } from 'react';

type SetterOrUpdater<T> = (valOrUpdater: ((currVal: T) => T) | T) => void;

interface PaginatedQueryParams<QT, T, R> {
  readonly query: DocumentNode;
  readonly convertData: (data: QT) => T[];
  readonly transformData?: (data: T[]) => R[];
  readonly queryOptions?: {
    readonly itemsPerPage?: number;
    readonly fetchPolicy?: FetchPolicy;
  };
  readonly variables?: Record<any, any>;
  readonly cacheState?: [R[], SetterOrUpdater<R[]>];
}

export default function usePaginatedQuery<QT, T, R = T>({
  query,
  convertData,
  transformData,
  queryOptions,
  variables,
  cacheState,
}: PaginatedQueryParams<QT, T, R>) {
  const [items, setItems] = useState<R[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchingMore, setFetchingMore] = useState(false);
  const dataRef = useRef<T[]>([]);

  const updateItems = useCallback<SetterOrUpdater<R[]>>(
    valOrUpdater => {
      if (cacheState) {
        cacheState[1](valOrUpdater);
      } else {
        setItems(valOrUpdater);
      }
    },
    [cacheState],
  );

  const onCompleted = useCallback(
    (data: QT) => {
      console.log('[APOLLO] onCompleted');
      const convertedData = convertData(data);
      dataRef.current = [...dataRef.current, ...convertedData];
      if (transformData) {
        updateItems(transformData(dataRef.current));
      } else {
        // @ts-ignore
        updateItems(dataRef.current);
      }
    },
    [convertData, transformData, updateItems],
  );

  const {
    refetch: refetchData,
    fetchMore: fetchMoreData,
    loading,
    error,
  } = useQuery<QT>(query, {
    variables: {
      ...variables,
      offset: 0,
      limit: queryOptions?.itemsPerPage ?? 20,
    },
    onCompleted,
    fetchPolicy: queryOptions?.fetchPolicy ?? 'no-cache',
  });

  const refresh = useCallback(async () => {
    console.log('[APOLLO] refresh');
    setRefreshing(true);
    await refetchData();
    setRefreshing(false);
  }, [refetchData]);

  const fetchMore = useCallback(async () => {
    console.log('[APOLLO] fetchMore');
    setFetchingMore(true);
    await fetchMoreData({
      variables: {
        offset: fetchOffsetRef.current,
      },
    });
    setFetchingMore(false);
  }, [fetchMoreData]);

  return {
    items: cacheState ? cacheState[0] : items,
    refresh,
    refreshing,
    fetchMore,
    fetchingMore,
    loading,
    error,
  };
}
