import { useActiveAccountAddress } from '@recoil/accounts';
import { useAppStateValue } from '@recoil/appState';
import { Post } from 'types/posts';
import { useCallback, useState } from 'react';
import { mergePosts, sortPostsByCreationDate } from 'lib/PostsUtils';
import { convertGraphQLPost } from 'lib/GraphQLUtils';
import { DocumentNode, useQuery } from '@apollo/client';

interface PostQueryResult {
  readonly posts: any[];
}

interface PostsDataByAddressOptions {
  /**
   * The GraphQL query to use to get the posts. It must accept the following variables:
   * - `subspaceId`: the ID of the subspace to get the posts from
   * - `user`: the address of the user to get the posts from
   * - `offset`: the offset to use to get the posts
   * - `limit`: the limit to use to get the posts
   *
   * The result of this query will be mapped using the `queryMapper` function.
   */
  readonly query: DocumentNode;

  /**
   * Any additional variable to execute the query with.
   */
  readonly variables?: any;

  /**
   * The address of the user to get the posts for.
   * If not provided, the active user address will be used.
   */
  readonly address?: string;

  /**
   * The number of posts to get per page.
   * Defaults to 50.
   */
  readonly postsPerPage?: number;

  /**
   * A function that allows to get the initial posts to display.
   * Defaults to returning an empty array.
   */
  readonly getInitialPosts?: (address: string) => Post[];

  /**
   * A function that allows to map the result of the query to a `PostQueryResult`.
   * Defaults to returning the `posts` field of the result.
   */
  readonly queryMapper?: (data: any | undefined) => PostQueryResult;
}

/**
 * Default function that returns an empty array.
 */
const defaultGetInitialPosts = () => [];

/**
 * Default function that returns the `posts` field of the result.
 * @param data {any | undefined} The data retrieved by the GraphQL server.
 */
const defaultQueryMapper = (data: any | undefined): PostQueryResult => ({
  posts: data.posts,
});

/**
 * Hook that allows to retrieve the posts associated to an address by querying the GraphQL server.
 * @param options {PostsDataByAddressOptions} The options to use to get the data.
 */
const usePostsDataByAddress = (options: PostsDataByAddressOptions) => {
  const activeUserAddress = useActiveAccountAddress();
  const userAddress = options.address || activeUserAddress;
  if (!userAddress) {
    throw new Error('No address provided and no active user address found!');
  }

  const subspaceId = useAppStateValue('subspaceId');

  // Utility things
  const getInitialPosts = options.getInitialPosts ?? defaultGetInitialPosts;
  const queryMapper = options.queryMapper ?? defaultQueryMapper;

  // Hook state
  const [posts, setPosts] = useState<Post[]>(getInitialPosts(userAddress));
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const onCompletedCallback = useCallback(
    (data: any) => {
      if (!data) return;

      const { posts: remotePosts } = data;
      const onChainPosts = (remotePosts ?? []).map(convertGraphQLPost);

      // Update the state
      setPosts(existingPosts => {
        const [mergedPosts] = mergePosts(existingPosts, onChainPosts);
        return mergedPosts;
      });
      setLoading(false);
      setRefreshing(false);
      setFetchingMore(false);
    },
    [setPosts],
  );

  const { refetch, fetchMore } = useQuery(options.query, {
    variables: {
      ...options.variables,
      subspaceId,
      user: userAddress,
      offset: 0,
      limit: options.postsPerPage ?? 20,
    },
    onCompleted: onCompletedCallback,
  });

  // Callback used to fetch more posts
  const fetchMorePosts = useCallback(async () => {
    try {
      setError(undefined);
      setFetchingMore(true);

      await fetchMore({
        // Increment the offset
        variables: { offset: posts.length },

        // Merge the data
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          if (queryMapper(fetchMoreResult).posts.length === 0) {
            setFetchingMore(false);
          }
          return {
            posts: fetchMoreResult ? [...prev.posts, ...queryMapper(fetchMoreResult).posts] : prev,
          };
        },
      });
    } catch (e: any) {
      setFetchingMore(false);
      setError(e.toString());
    }
  }, [fetchMore, posts.length, queryMapper]);

  // Callback used to refresh the posts
  const refetchPosts = useCallback(async () => {
    try {
      setError(undefined);
      setRefreshing(true);

      // Get the new data by resetting the fetch offset to restart post fetching
      const { data } = await refetch({ offset: 0 });
      onCompletedCallback(queryMapper(data));
    } catch (e: any) {
      setRefreshing(false);
      setError(e.toString());
    }
  }, [onCompletedCallback, refetch, queryMapper]);

  return {
    posts: sortPostsByCreationDate(posts),
    loading,
    refetch: refetchPosts,
    refreshing,
    fetchMore: fetchMorePosts,
    fetchingMore,
    error,
  };
};

export default usePostsDataByAddress;
