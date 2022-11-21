import React from 'react';
import {
  atom,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import {useQuery} from '@apollo/client';
import GetLastPostsByAddress from 'services/graphql/queries/GetLastPostsByAddress';
import EnvConfig from 'config/EnvConfig';
import useActiveAccount from 'hooks/useActiveAccount';
import {
  PendingPostEnum,
  pendingPostsState,
} from '@recoil/pendingTx/pendingPosts';
import {useSyncPendingPosts} from 'hooks/usePendingPosts';

export const latestPostsByUserState = atom<PostItem[]>({
  key: 'latestPosts',
  default: [],
});

/**
 * A hook that manages logic related to polling the user's latest posts
 * @param {number} limit - The amount of posts to poll
 */
const usePollLatestPostsByUser = (limit: number) => {
  const {activeAddress} = useActiveAccount();
  const setLatestPostsByUser = useSetRecoilState(latestPostsByUserState);
  const resetLatestPosts = useResetRecoilState(latestPostsByUserState);
  const pendingPosts = useRecoilValue(pendingPostsState(PendingPostEnum.POST));
  useSyncPendingPosts();

  const {data, startPolling, stopPolling, loading} = useQuery(
    GetLastPostsByAddress,
    {
      variables: {
        limit,
        subspaceID: EnvConfig.APP_SUBSPACE_ID,
        user: activeAddress!,
        reaction: {
          '@type': '/desmos.reactions.v1.RegisteredReactionValue',
          registered_reaction_id: 9,
        },
      },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
    },
  );

  React.useEffect(() => {
    if (!loading && data) {
      const {post} = data;
      setLatestPostsByUser(post);
    }
  }, [JSON.stringify(data)]);

  React.useEffect(() => {
    if (pendingPosts.length > 0) {
      startPolling(EnvConfig.POLLING_INTERVAL);
    } else {
      resetLatestPosts();
      stopPolling();
    }
  }, [pendingPosts.length]);
};

export default usePollLatestPostsByUser;
