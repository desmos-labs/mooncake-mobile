import { DocumentNode } from '@apollo/client';
import useCustomLazyQuery from 'hooks/graphql/useCustomLazyQuery';
import sleep from 'lib/sleep';
import { useCallback, useState } from 'react';

interface SearchProps<QueryData, F> {
  valueToSearch: string;
  resultsPerPage?: number;
  query: DocumentNode;
  conversionCallback: (data: QueryData) => F;
}

/**
 * Hook that contains all the logic for the search view component
 * @param valueToSearch The value to search for inside the search bar
 * @param resultsPerPage The number of results to show per page
 * @param query The query to use to search for the items
 * @param conversionCallback The callback to use to convert the items returned by the query
 */
const useSearchData = <QueryData, T>({
  valueToSearch,
  resultsPerPage = 20,
  query,
  conversionCallback,
}: SearchProps<QueryData, T>) => {
  const [getLazyData, { fetchMore }] = useCustomLazyQuery(query, {
    variables: {
      search: `%${valueToSearch}%`,
      limit: resultsPerPage,
      offset: 0,
    },
  });
  const [items, setItems] = useState<T[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchingMore, setIsSearchingMore] = useState(false);

  const searchItems = useCallback(async () => {
    const results = await getLazyData();
    return ((results && results.data?.items) || []).map(conversionCallback);
  }, [getLazyData]);

  const getItemsFromSearchValue = useCallback(async () => {
    setIsSearching(true);
    const convertedPosts = valueToSearch === '' ? [] : await searchItems();
    setItems(convertedPosts);
    await sleep(500);
    setIsSearching(false);
  }, [searchItems, valueToSearch]);

  const fetchMoreItems = useCallback(async () => {
    setIsSearchingMore(true);
    const results = await fetchMore({
      variables: { offset: items.length },
    });

    const convertedItems =
      valueToSearch === '' ? [] : ((results && results.data?.items) || []).map(conversionCallback);
    setItems(prev => [...prev, ...convertedItems]);
    await sleep(500);
    setIsSearchingMore(false);
  }, [fetchMore, valueToSearch]);

  return {
    getItemsFromSearchValue,
    items,
    isSearching,
    isSearchingMore,
    fetchMoreItems,
  };
};

export default useSearchData;
