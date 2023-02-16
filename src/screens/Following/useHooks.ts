import { DocumentNode, useQuery } from '@apollo/client';
import { QueueData as QueueFollowing } from 'services/graphql/queries/GetPaginatedFollowing';
import { QueueData as QueueFollowers } from 'services/graphql/queries/GetPaginatedFollowers';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import numOfFollowerState from '@recoil/numOfFollowerState';
import _ from 'lodash';

type QueueData = QueueFollowing | QueueFollowers;

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
 * @param {number} subspaceId - number - The ID of the subspace you want to get the followers of.
 * @param {string} userAddress - string
 * @returns An object with the following properties:
 * - loading: boolean
 * - error: string
 * - data: QueueData
 * - fetchMore: () => void
 * - refetch: () => void
 */
const useHooks = (subspaceId: number, userAddress: string, query: DocumentNode) => {
  const [paginatedData, setPaginatedData] = useState<ProfileSummary[]>([]);

  /* It's making a GraphQL query to the server. */
  const { loading, error, data, fetchMore, refetch, variables } = useQuery<QueueData>(query, {
    variables: {
      subspaceId,
      userAddress,
      limit: ITEMS_PER_FETCH,
      offset: 0,
    },
    fetchPolicy: 'no-cache',
  });

  const dataOrNull = !loading && !error && data ? data : null;
  const offset = variables?.offset ?? 0;
  useEffect(() => {
    if (!dataOrNull) return;
    setPaginatedData(prevData => {
      const newData = dataOrNull.paginatedFollowers.map(({ _: ps }) => ps);
      const mergedData = _.uniqBy(
        offset < prevData.length
          ? prevData.slice(0, offset).concat(newData) // refetch or concurrent fetchMore
          : prevData.concat(newData),
        'address',
      );
      return _.isEqual(prevData, mergedData) ? prevData : mergedData;
    });
  }, [dataOrNull, offset]);

  const count = data?.paginatedFollowers?.length ?? 0;
  const setNumOfFollowers = useSetRecoilState(
    numOfFollowerState({ type: 'following', subspaceId, userAddress }),
  );
  useEffect(() => setNumOfFollowers(count), [count]);

  /* It's making a GraphQL query to the server. */
  const nextOffset = offset + (data?.paginatedFollowers?.length ?? 0);
  const fetchMoreCallback = useCallback(() => {
    fetchMore({
      variables: {
        offset: nextOffset,
      },
    });
  }, [subspaceId, userAddress, nextOffset]);

  const refetchCallback = useCallback(() => {
    refetch({ subspaceId, userAddress, offset: 0 });
  }, [subspaceId, userAddress]);

  /* Refetch when subspaceId, userAddress changed. */
  const called = useRef(false);
  useEffect(() => {
    if (called.current) {
      refetchCallback();
    } else {
      called.current = true;
    }
  }, [subspaceId, userAddress]);

  return {
    loading,
    error,
    data: _.compact(paginatedData),
    fetchMore: fetchMoreCallback,
    refetch: refetchCallback,
  };
};

export default useHooks;
