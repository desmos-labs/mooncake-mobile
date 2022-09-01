import {useQuery} from '@apollo/client';
import GetFollowing, {
  QueueData,
} from 'services/graphql/queries/GetPaginatedFollowing';
import {useCallback, useEffect} from 'react';
import {useSetRecoilState} from 'recoil';
import numOfFollowerState from '@recoil/numOfFollowerState';

// // START debug
// import {ApolloError} from '@apollo/client';
// import {QueueData} from 'services/graphql/queries/GetPaginatedFollowing';
// import {useCallback, useEffect, useRef, useState} from 'react';
// import {useSetRecoilState} from 'recoil';
// import numOfFollowerState from '@recoil/numOfFollowerState';
// // END debug

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
 * @param {number} subspaceID - number - The ID of the subspace you want to get the followers of.
 * @param {string} userAddress - string
 * @returns An object with the following properties:
 * - loading: boolean
 * - error: string
 * - data: QueueData
 * - fetchMore: () => void
 * - refetch: () => void
 */
const useHooks = (subspaceID: number, userAddress: string) => {
  /* It's making a GraphQL query to the server. */
  const {loading, error, data, fetchMore, refetch} = useQuery<QueueData>(
    GetFollowing,
    {
      variables: {
        subspaceID,
        userAddress,
        limit: ITEMS_PER_FETCH,
        offset: 0,
      },
    },
  );

  // // START debug
  // console.log({subspaceID, userAddress});
  // const id = useRef(0);
  // const [data, setData] = useState<QueueData>();
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<ApolloError>();
  // const fetchMore = (_: unknown) => fetch();
  // const refetch = (_: any) => fetch();
  // const fetch = useCallback(() => {
  //   setLoading(true);
  //   setError(undefined);
  //   setTimeout(
  //     () => {
  //       if (Math.random() > 1) {
  //         setLoading(false);
  //         setError(new ApolloError({errorMessage: 'random error'}));
  //         return;
  //       }
  //       const paginatedFollowers: QueueData['paginatedFollowers'] = [];
  //       for (let i = 0; i < 20; i++) {
  //         if (id.current >= 10000000) break;
  //         paginatedFollowers.push({
  //           _: {
  //             dtag: `GoFind.${++id.current}`,
  //             address: 'desmos1p7ce9sydhm7dsugl890g9unmp99nmq0gz9f4vx',
  //             nickname: `GoFind.${id.current}`,
  //             profile_pic: `https://picsum.photos/40?.${id.current}`,
  //           },
  //         });
  //         paginatedFollowers.push({
  //           _: {
  //             dtag: `Masternode24.${++id.current}`,
  //             address: 'desmos1h5f3dywec65v9qulxkmcv3e6yujyh3zm39lr4r',
  //             nickname: `Masternode24.de.${id.current}`,
  //             profile_pic: `https://picsum.photos/40?.${id.current}`,
  //           },
  //         });
  //         paginatedFollowers.push({
  //           _: {
  //             dtag: `dima_student2.${++id.current}`,
  //             address: 'desmos1ys42amj53hka8mx4h2nvz4hxf82v9rwvn6xuxh',
  //             nickname: `dima_student2#2856.${id.current}`,
  //             profile_pic: `https://picsum.photos/40?.${id.current}`,
  //           },
  //         });
  //         paginatedFollowers.push({
  //           _: {
  //             dtag: `!Masternode24.${++id.current}`,
  //             address: 'desmos1h5f3dywec65v9qulxkmcv3e6yujyh3zm39lr4r',
  //             nickname: `!Masternode24.de.${id.current}`,
  //             profile_pic: `https://picsum.photos/40?.${id.current}`,
  //           },
  //         });
  //         paginatedFollowers.push({
  //           _: {
  //             dtag: `!dima_student2.${++id.current}`,
  //             address: 'desmos1ys42amj53hka8mx4h2nvz4hxf82v9rwvn6xuxh',
  //             nickname: `!dima_student2#2856.${id.current}`,
  //             profile_pic: '',
  //           },
  //         });
  //       }
  //       setLoading(false);
  //       setError(undefined);
  //       setData({
  //         paginatedFollowers,
  //         user_relationship_aggregate: {
  //           aggregate: {
  //             count: 10000000,
  //           },
  //         },
  //       });
  //     },
  //     Math.random() > 1 ? 60000 : 1000,
  //   );
  // }, []);
  // useEffect(fetch, []);
  // // END debug

  const setNumOfFollowers = useSetRecoilState(numOfFollowerState('following'));
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
