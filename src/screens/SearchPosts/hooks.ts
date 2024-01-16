import useCustomLazyQuery from 'hooks/graphql/useCustomLazyQuery';
import { convertGraphQLPost } from 'lib/GraphQLUtils';
import sleep from 'lib/sleep';
import { useCallback, useState } from 'react';
import SearchPosts from 'services/graphql/queries/SearchPosts';
import { Post } from 'types/posts';

/**
 * Hook that contains all the logic for the search view component
 * @param valueToSearch The value to search for inside the search bar
 * @param resultsPerPage The number of results to show per page
 */
const useSearch = (valueToSearch: string, resultsPerPage: number = 20) => {
  const [getLazyData, { fetchMore }] = useCustomLazyQuery(SearchPosts, {
    variables: {
      search: `%${valueToSearch}%`,
      limit: resultsPerPage,
      offset: 0,
    },
  });
  const [posts, setPosts] = useState<Post[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchPostsOnChain = useCallback(async () => {
    const results = await getLazyData();
    return ((results && results?.posts) || []).map((post: any) => convertGraphQLPost(post));
  }, [getLazyData]);

  /**
   * Gets the profile for the given DTag
   */
  const getPostsFromSearchValue = useCallback(async () => {
    setIsSearching(true);
    const convertedPosts = valueToSearch === '' ? [] : await searchPostsOnChain();
    setPosts(convertedPosts);
    await sleep(500);
    setIsSearching(false);
  }, [searchPostsOnChain, valueToSearch]);

  const fetchMorePosts = useCallback(async () => {
    const results = await fetchMore({
      variables: { offset: posts.length },
    });

    const convertedProfiles =
      valueToSearch === ''
        ? []
        : ((results && results?.data.posts) || []).map((post: any) => convertGraphQLPost(post));
    setPosts(prev => [...prev, ...convertedProfiles]);
  }, [fetchMore, posts.length, valueToSearch]);

  return {
    getPostsFromSearchValue,
    posts,
    isSearching,
    fetchMorePosts,
  };
};

export default useSearch;
