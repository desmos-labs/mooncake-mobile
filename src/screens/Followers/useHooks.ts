import {useQuery} from '@apollo/client';
import GetPaginatedQuery, {
  QueueData,
} from 'services/graphql/queries/GetPaginatedFollowers';
import {useCallback, useEffect} from 'react';
import {useSetRecoilState} from 'recoil';
import numOfFollowerState from '@recoil/numOfFollowerState';

/* It's setting the limit of the number of items to be fetched. */
export const ITEMS_PER_FETCH = 100;

/**
 * @property {T[]} data - The actual data that we want to display.
 * @property {number} count - The total number of records in the database.
 */
export type PaginatedData<T> = {
  data: T[];
  count: number;
};

/**
 * @param {number} subspaceID - number - The ID of the subspace you want to get the followers from.
 * @param {string} userAddress - The address of the user who is viewing the followers.
 * @returns It's returning an object with the following properties:
 * - loading: boolean
 * - error: any
 * - data: QueueData
 * - fetchMore: () => void
 * - refetch: () => void
 */
const useHooks = (subspaceID: number, userAddress: string) => {
  /* It's making a GraphQL query to the server. */
  const {loading, error, data, fetchMore, refetch} = useQuery<QueueData>(
    GetPaginatedQuery,
    {
      variables: {
        subspaceID,
        userAddress,
        limit: ITEMS_PER_FETCH,
        offset: 0,
      },
    },
  );

  const setNumOfFollowers = useSetRecoilState(
    numOfFollowerState({type: 'followers', subspaceID, userAddress}),
  );
  useEffect(
    () =>
      setNumOfFollowers(
        data?.user_relationship_aggregate?.aggregate.count ?? 0,
      ),
    [data],
  );

  /* It's making a GraphQL query to the server. */
  const fetchMoreCallback = useCallback(() => {
    fetchMore({
      variables: {
        offset: data?.paginatedFollowers.length ?? 0,
      },
    });
  }, [data]);

  const refetchCallback = useCallback(() => {
    refetch({offset: 0});
  }, []);

  return {
    loading,
    error,
    data,
    fetchMore: fetchMoreCallback,
    refetch: refetchCallback,
  };
};

export default useHooks;
