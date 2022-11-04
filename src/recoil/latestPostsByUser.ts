import React from 'react';
import {
  atomFamily,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import {useQuery} from '@apollo/client';
import GetLastPostsByAddress from 'services/graphql/queries/GetLastPostsByAddress';
import EnvConfig from 'config/EnvConfig';
import useActiveAccount from 'hooks/useActiveAccount';
import {hasPendingPosts, PendingPostEnum} from '@recoil/pendingTx/pendingPosts';
import GetLatestCommentsByAddress from 'services/graphql/queries/GetLatestCommentsByAddress';

export const latestPostsByUserState = atomFamily<PostItem[], PendingPostEnum>({
  key: 'latestPosts',
  default: [],
});

/**
 * A hook that manages logic related to polling the user's latest posts
 * @param {number} limit - The amount of posts to poll
 */
const usePollLatestPostsByUser = (limit: number, type: PendingPostEnum) => {
  const {activeAddress} = useActiveAccount();
  const setLatestPostsByUser = useSetRecoilState(latestPostsByUserState(type));
  const resetLatestPosts = useResetRecoilState(latestPostsByUserState(type));
  const shouldPollPosts = useRecoilValue(hasPendingPosts(type));

  const query =
    type === PendingPostEnum.POST
      ? GetLastPostsByAddress
      : GetLatestCommentsByAddress;

  const {data, startPolling, stopPolling} = useQuery(query, {
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
  });

  React.useEffect(() => {
    if (data) {
      const {post} = data;
      setLatestPostsByUser(post);
    }
  }, [data]);

  React.useEffect(() => {
    if (shouldPollPosts) {
      console.log('pending', type, 'detected, starting polling');
      startPolling(EnvConfig.POLLING_INTERVAL);
    } else {
      console.log('no pending', type, 'detected, stopping polling');
      resetLatestPosts();
      stopPolling();
    }
  }, [shouldPollPosts]);
};

export default usePollLatestPostsByUser;
