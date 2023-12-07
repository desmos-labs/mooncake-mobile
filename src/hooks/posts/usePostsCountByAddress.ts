import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import GetPostsCountByUser from 'services/graphql/queries/GetPostsCountByUser';

/**
 * Hook that returns the count of all the posts created, liked and tipped by a user.
 * @param address {string} The address of the user to retrieve the posts from.
 */
const usePostsCountByAddress = (address: string) => {
  const { data, loading, refetch } = useQuery(GetPostsCountByUser, {
    variables: {
      user: address,
    },
  });

  // Compute the overall count
  const count = useMemo(() => {
    const createdCount = data?.createdPosts?.aggregate?.count ?? 0;
    const likedCount = data?.likedPosts?.aggregate?.count ?? 0;
    return createdCount + likedCount;
  }, [data]);

  return {
    count,
    loading,
    refetch,
  };
};

export default usePostsCountByAddress;
