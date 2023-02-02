// START debug
import { ApolloError, DocumentNode } from '@apollo/client';
import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import numOfFollowerState from '@recoil/numOfFollowerState';

const MAX_MOCK_FOLLOWERS = 10000000;
function mockGaginatedFollowers(ref: MutableRefObject<ProfileSummary[]>, initialOffset: number) {
  const paginatedFollowers = ref.current;
  let offset = initialOffset;
  for (let i = 0; i < 20; i++) {
    if (offset >= MAX_MOCK_FOLLOWERS) break;
    const i1 = {
      dtag: `GoFind.${offset}`,
      address: `desmos1p7ce9sydhm7dsugl890g9unmp99nmq0gz9f4vx.${offset}`,
      nickname: `GoFind.${offset}`,
      profile_pic: `https://picsum.photos/40?.${offset}`,
    };
    if (offset in paginatedFollowers) paginatedFollowers[offset] = i1;
    else paginatedFollowers.push(i1);
    offset++;
    const i2 = {
      dtag: `Masternode24.${offset}`,
      address: `desmos1h5f3dywec65v9qulxkmcv3e6yujyh3zm39lr4r.${offset}`,
      nickname: `Masternode24.de.${offset}`,
      profile_pic: `https://picsum.photos/40?.${offset}`,
    };
    if (offset in paginatedFollowers) paginatedFollowers[offset] = i2;
    else paginatedFollowers.push(i2);
    offset++;
    const i3 = {
      dtag: `dima_student2.${offset}`,
      address: `desmos1ys42amj53hka8mx4h2nvz4hxf82v9rwvn6xuxh.${offset}`,
      nickname: `dima_student2#2856.${offset}`,
      profile_pic: `https://picsum.photos/40?.${offset}`,
    };
    if (offset in paginatedFollowers) paginatedFollowers[offset] = i3;
    else paginatedFollowers.push(i3);
    const i4 = {
      dtag: `!Masternode24.${offset}`,
      address: `desmos1h5f3dywec65v9qulxkmcv3e6yujyh3zm39lr4r.${offset}`,
      nickname: `!Masternode24.de.${offset}`,
      profile_pic: `https://picsum.photos/40?.${offset}`,
    };
    if (offset in paginatedFollowers) paginatedFollowers[offset] = i4;
    else paginatedFollowers.push(i4);
    offset++;
    const i5 = {
      dtag: `!dima_student2.${offset}`,
      address: `desmos1ys42amj53hka8mx4h2nvz4hxf82v9rwvn6xuxh.${offset}`,
      nickname: `!dima_student2#2856.${offset}`,
      profile_pic: '',
    };
    if (offset in paginatedFollowers) paginatedFollowers[offset] = i5;
    else paginatedFollowers.push(i5);
    offset++;
  }
  return paginatedFollowers;
}
// END debug

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
const useHooks = (subspaceID: number, userAddress: string, query: DocumentNode) => {
  console.log('useHooks', { subspaceID, userAddress, query });

  // START debug
  const paginatedFollowers = useRef<ProfileSummary[]>([]);
  const [data, setData] = useState<ProfileSummary[]>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApolloError>();
  function fetchMore(params: { variables: { offset: number } }) {
    console.log('fetchMore', params);
    return fetch(params.variables.offset);
  }
  function refetch(params: { offset: number }) {
    console.log('refetch', params);
    return fetch(params.offset);
  }
  function fetch(offset: number) {
    console.log('fetch', offset);
    setLoading(true);
    setError(undefined);
    setTimeout(
      () => {
        console.log('fetching', offset);
        if (Math.random() > 1) {
          setLoading(false);
          setError(new ApolloError({ errorMessage: 'random error' }));
          return;
        }
        setLoading(false);
        setError(undefined);
        setData(mockGaginatedFollowers(paginatedFollowers, offset));
      },
      Math.random() > 1 ? 60000 : 1000,
    );
  }
  useEffect(() => fetch(0), []);
  // END debug

  const setNumOfFollowers = useSetRecoilState(
    numOfFollowerState({ type: 'following', subspaceID, userAddress }),
  );
  useEffect(() => setNumOfFollowers(MAX_MOCK_FOLLOWERS), [data]);

  /* It's making a GraphQL query to the server. */
  const fetchMoreCallback = useCallback(() => {
    fetchMore({
      variables: {
        offset: data?.length ?? 0,
      },
    });
  }, [data]);

  const refetchCallback = useCallback(() => {
    refetch({ offset: 0 });
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
