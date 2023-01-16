import {useCallback} from 'react';
import {atom, useSetRecoilState} from 'recoil';
import {useLazyQuery} from '@apollo/client';
import GetLastPostsByAddress from 'services/graphql/queries/GetLastPostsByAddress';
import EnvConfig from 'config/EnvConfig';
import useActiveAccount from 'hooks/useActiveAccount';

import {useSyncPendingPosts} from 'hooks/usePendingPosts';

export const latestPostsByUserState = atom<PostItem[]>({
  key: 'latestPosts',
  default: [],
});

/**
 * Get the last 5 posts from the current user's active address
 */
export const useGetLatestPostsByActiveAddress = () => {
  const {activeAddress} = useActiveAccount();
  const setLatestPostsByUser = useSetRecoilState(latestPostsByUserState);

  useSyncPendingPosts();

  const [, {refetch}] = useLazyQuery(GetLastPostsByAddress, {
    variables: {
      limit: 5,
      subspaceID: EnvConfig.APP_SUBSPACE_ID,
      user: activeAddress,
      reaction: {
        '@type': '/desmos.reactions.v1.RegisteredReactionValue',
        registered_reaction_id: 9,
      },
    },
  });

  const getLatestPostsByActiveAddress = useCallback(async () => {
    const {data} = await refetch({
      user: activeAddress,
      subspaceID: EnvConfig.APP_SUBSPACE_ID,
    });
    const {post} = data;
    setLatestPostsByUser(post);
  }, [refetch, activeAddress]);

  return {
    getLatestPostsByActiveAddress,
  };
};
