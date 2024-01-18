import sleep from 'lib/sleep';
import _ from 'lodash';
import React from 'react';

/**
 * Type that represents the data fetched from @see {@link FetchDataFunction} function.
 * @typeParam T - Type of the fetched data.
 */
type PaginatedResult<T> = {
  /**
   * List of fetched items.
   */
  data: T[];
  /**
   * Optional boolean that tells that there aren't any other elements to fetch.
   * If this is undefined will consider the end reached if the length of data
   * is less than the configured items per page.
   */
  endReached?: boolean;
};

/**
 * Type that represents a function capable of fetching data in a paginated
 * manner.
 * @typeParam T - Type of the fetched data.
 * @typeParam F - Type of the filter.
 */
export type FetchDataFunction<T, F extends Object = {}> = (
  offset: number,
  limit: number,
  filter?: F,
) => PaginatedResult<T> | Promise<PaginatedResult<T>>;

/**
 * Interface that represents the configurations that can be provided to the
 * usePaginatedData hook.
 */
interface PaginatedDataConfig<T, F extends Object, M = T> {
  /**
   * Number of items that should be fetched per page.
   */
  readonly itemsPerPage: number;
  /**
   * Amount of ms that the fetchMore function will wait
   * before completing.
   */
  readonly extraDelay?: number;
  /**
   * Debounce time applied to the update filter function.
   * If undefined will be used 300ms.
   */
  readonly updateFilterDebounceTimeMs?: number;
  /**
   * Filter that will be applied at the beginning.
   */
  readonly initialFilter?: F;
  /**
   * If true the `updatingFilter` filed will be set to true
   * as soon the updateFilter function is called instead of waiting
   * for the debounce time to expire.
   */
  readonly notifyUpdateFilterDuringDebounce?: boolean;
  /**
   * Optional action that will be executed before
   * fetching a page.
   */
  readonly onPreFetchPage?: (page: number) => Promise<any>;
  /**
   * Callback that will be called each time the data changes.
   * This can be used for example to implement a caching logic by
   * updating a state that is outside of this hook and use this
   * ones in a list instead of the items returned by this hook.
   */
  readonly onDataChanged?: (data: M[]) => any;
  /**
   * Optional action to exec before executing the refetch action.
   * This can be usefull if you need to perform an action before
   * refreshing the data.
   */
  readonly preRefetchAction?: () => Promise<any>;
  /**
   * If this field is true the first page will be automatically fetched
   * instead of waiting for a call to the fetchMore function.
   * Thi can be usefull when using this hook with a FlatList component
   * that don't call the fetchMore function if the list is empty.
   */
  readonly autoFetchFirstPage?: boolean;
  /**
   * Optional function to get the total number of items that can be
   * fetched.
   */
  readonly getTotalItemsCount?: () => Promise<number>;
  /**
   * Optional function to convert the whole list of data.
   * This can be used to convert all the fetched items or if we
   * need to merge the fetched data with some cached data.
   */
  readonly mapData?: (data: T[]) => M[];
}

/**
 * Hook that allows to fetch data in a paginated manner using an optional
 * filter.
 * @param fetchFunction - Function to fetch the data.
 * @param config - Data pagination config.
 * @typeParam T - Type of the fetched data.
 * @typeParam F - Type of the filter.
 */
export function usePaginatedData<T, F extends Object, M = T>(
  fetchFunction: FetchDataFunction<T, F>,
  config: PaginatedDataConfig<T, F, M>,
) {
  // Hook configs
  const {
    itemsPerPage,
    extraDelay,
    updateFilterDebounceTimeMs,
    initialFilter,
    notifyUpdateFilterDuringDebounce,
    onPreFetchPage,
    onDataChanged,
    preRefetchAction,
    mapData,
    autoFetchFirstPage,
    getTotalItemsCount,
  } = config;

  // Internal state variable, those are refs to avoid renders when
  // the fetch more functions update those fields after each invocation.
  const firstExecution = React.useRef(true);
  const currentOffset = React.useRef<number>(0);
  const fetchingOffset = React.useRef<number>();
  const endReachedRef = React.useRef(false);
  const filter = React.useRef(initialFilter);
  const dataRef = React.useRef<T[]>([]);
  const preFetchPageRef = React.useRef(onPreFetchPage);
  const preRefetchActionRef = React.useRef(preRefetchAction);
  const getTotalItemsCountRef = React.useRef(getTotalItemsCount);
  const mapDataRef = React.useRef(mapData);

  // Keep this ref that we update with an effect
  // to prevent the recreation of the `fetchMore` function
  // when this function changes.
  const onDataChangedRef = React.useRef(onDataChanged);

  // -------- STATES --------
  const [data, setData] = React.useState<M[]>([]);
  const [filterState, setFilterState] = React.useState(initialFilter);
  const [loading, setLoading] = React.useState(!!autoFetchFirstPage);
  const [refreshing, setRefreshing] = React.useState(false);
  const [updatingFilter, setUpdatingFilter] = React.useState(false);
  const [error, setError] = React.useState<Error>();
  const [totalItemsCount, setTotalItemsCount] = React.useState(0);

  // -------- CALLBACKS --------

  // Function to fetch the next `itemsPerPage` items.
  const fetchDataFunction = React.useCallback(
    async (reset?: boolean, isRefresh?: boolean) => {
      if (endReachedRef.current && reset !== true) {
        // Nothing more to fetch.
        return;
      }

      // Current offset.
      let fetchOffset = reset ? 0 : currentOffset.current;

      // Prevent fetch of the same offset.
      if (reset !== true && fetchingOffset.current === fetchOffset) {
        return;
      }

      setLoading(true);
      fetchingOffset.current = fetchOffset;

      // Get the total items at the first fetch.
      if (fetchOffset === 0 && getTotalItemsCountRef.current !== undefined) {
        try {
          const totalCount = await getTotalItemsCountRef.current();
          setTotalItemsCount(totalCount);
        } catch (e) {
          // Ignored.
          setTotalItemsCount(0);
        }
      }

      // Temp var where we keep the fetched items until we have them all.
      const fetchedItems: T[] = [];

      let stopFetch = false;
      let fetchError: Error | undefined;

      // Loop to fetch exactly itemsPerPage elements even if the fetchFunction
      // returns less than itemsPerPage items because have filtered the
      // items inside the requested page.
      let endReached: boolean | undefined;
      while (fetchedItems.length < itemsPerPage && !stopFetch) {
        // Compute how many items we need to fetch
        const fetchLimit = itemsPerPage - fetchedItems.length;
        let fetchedData: T[];
        try {
          if (preFetchPageRef.current) {
            // eslint-disable-next-line no-await-in-loop
            await preFetchPageRef.current(fetchOffset);
          }
          // eslint-disable-next-line no-await-in-loop
          const fetchResult = await fetchFunction(fetchOffset, fetchLimit, filter.current);
          fetchedData = fetchResult.data;
          endReached = fetchResult.endReached;
        } catch (e) {
          fetchError = e as Error;
          fetchedData = [];
          endReached = true;
        }
        // Store the fetched items.
        fetchedItems.push(...fetchedData);
        fetchOffset += fetchLimit;
        stopFetch = endReached ?? fetchedData.length < fetchLimit;
      }

      // Check if we have fetched all the items from the server.
      endReachedRef.current = endReached ?? fetchedItems.length < itemsPerPage;

      // Update the current offset.
      currentOffset.current = fetchOffset;

      if (extraDelay !== undefined && extraDelay > 0) {
        await sleep(extraDelay);
      }
      if (isRefresh) {
        setRefreshing(false);
        // This has been added to prevent the refresh control animation to flicker while the list is being updated
        await sleep(500);
      }
      if (fetchedItems.length >= 0) {
        dataRef.current = reset ? fetchedItems : [...dataRef.current, ...fetchedItems];
        // Safe to cast to M[], if the dataMapFunction is not defined, M will be equal to T.
        // Otherwise, if dataMapFunction is defined, M can be different from T, and in this case, the
        // data will be an array of M.
        const newData = (
          mapDataRef.current ? mapDataRef.current(dataRef.current) : dataRef.current
        ) as M[];
        setData(newData);
        if (fetchError === undefined) {
          onDataChangedRef.current?.(newData);
        }
      } else if (fetchError !== undefined) {
        setError(fetchError);
      }
      setLoading(false);
    },
    [extraDelay, fetchFunction, itemsPerPage],
  );

  const fetchMore = React.useCallback(async () => {
    await fetchDataFunction();
  }, [fetchDataFunction]);

  // Function to refresh the data, all the items fetched will be
  // cleared and the `fetchDataFunction` function will start to fetch the items
  // from the items with index 0.
  const refresh = React.useCallback(async () => {
    setRefreshing(true);
    setError(undefined);
    // This set timeout is used to allow the refresh control animation to complete
    // and prevents any animation flickering
    setTimeout(async () => {
      try {
        if (preRefetchActionRef.current !== undefined) {
          await preRefetchActionRef.current();
        }
        await fetchDataFunction(true, true);
      } catch (e) {
        setError(e as Error);
      }
    }, 500);
  }, [fetchDataFunction]);

  // Function to update the current filter.
  const setFilter = React.useCallback(
    async (newFilter: React.SetStateAction<F | undefined>) => {
      setFilterState(newFilter);
      if (typeof newFilter === 'function') {
        filter.current = newFilter(filter.current);
      } else {
        filter.current = newFilter;
      }
      setUpdatingFilter(true);
      await fetchDataFunction(true);
      setUpdatingFilter(false);
    },
    [fetchDataFunction],
  );

  // Debounced version of setFilter.
  const debouncedSetFilter = React.useMemo(
    () => _.debounce(setFilter, updateFilterDebounceTimeMs ?? 300),
    [setFilter, updateFilterDebounceTimeMs],
  );

  // Function to update the filter.
  const updateFilter = React.useCallback(
    (newFilter?: F | React.SetStateAction<F | undefined>, noDebounce?: boolean) => {
      if (!noDebounce) {
        if (notifyUpdateFilterDuringDebounce) {
          setUpdatingFilter(true);
        }

        debouncedSetFilter(newFilter);
      } else {
        // Cancel a possible debounced execution.
        debouncedSetFilter.cancel();
        // Update the filter and trigger the refresh.
        setFilter(newFilter);
      }
    },
    [notifyUpdateFilterDuringDebounce, debouncedSetFilter, setFilter],
  );

  // -------- EFFECTS --------

  // Hook to update the onDataChangedRef.
  React.useEffect(() => {
    onDataChangedRef.current = onDataChanged;
  }, [onDataChanged]);

  // Hook to clear the debounced function when the component is destroyed.
  React.useEffect(
    () => () => {
      debouncedSetFilter.cancel();
    },
    [debouncedSetFilter],
  );

  // Hook to update the preFetchPageRef.
  React.useEffect(() => {
    preFetchPageRef.current = onPreFetchPage;
  }, [onPreFetchPage]);

  // Hook to update the preRefetchAction ref.
  React.useEffect(() => {
    preRefetchActionRef.current = preRefetchAction;
  }, [preRefetchAction]);

  // Hook to update the getTotalItemsCount ref.
  React.useEffect(() => {
    getTotalItemsCountRef.current = getTotalItemsCount;
  }, [getTotalItemsCount]);

  // Hook to update the getTotalItemsCount ref.
  React.useEffect(() => {
    mapDataRef.current = mapData;
    if (mapData !== undefined && !loading) {
      setData(mapData(dataRef.current));
    }
    // Safe to ignore the loading deps.
    // We want to update the mapDataRef each time the
    // orignal functio changes and if we are not loading we also
    // update the data.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapData]);

  // Effect to trigger the refresh function when `fetchFunction` or
  // the `itemsPerPage` changes.
  React.useEffect(() => {
    // Check if is not the first time that this effect has been triggered,
    // in this case we call the refresh function since that means that the
    // `fetchFunction` or `itemsPerPage` have changed.
    if (!firstExecution.current) {
      refresh();
    } else {
      firstExecution.current = false;
    }
  }, [refresh]);

  React.useEffect(() => {
    if (autoFetchFirstPage) {
      fetchMore();
    }
    // Safe to disable we want to execute this effect only when
    // the autoFetchFirstPage flag changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetchFirstPage]);

  return {
    data,
    filter: filterState,
    fetchMore,
    refresh,
    loading,
    updatingFilter,
    initialLoading: false,
    refreshing,
    updateFilter,
    error,
    totalItemsCount,
  };
}
