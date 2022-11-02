import React from 'react';
import {atom, useSetRecoilState} from 'recoil';
import {useQuery} from '@apollo/client';
import GetLastPostsByAddress from 'services/graphql/queries/GetLastPostsByAddress';
import EnvConfig from 'config/EnvConfig';
import useActiveAccount from 'hooks/useActiveAccount';

export const latestPostsByUserState = atom<PostItem[]>({
  key: 'latestPosts',
  default: [],
});

const usePollLatestPostsByUser = (limit: number) => {
  const {activeAddress} = useActiveAccount();
  const setLatestPostsByUser = useSetRecoilState(latestPostsByUserState);

  const {data} = useQuery(GetLastPostsByAddress, {
    variables: {
      limit,
      subspaceID: EnvConfig.APP_SUBSPACE_ID,
      user: activeAddress!,
      reaction: {
        '@type': '/desmos.reactions.v1.RegisteredReactionValue',
        registered_reaction_id: 9,
      },
    },
    pollInterval: EnvConfig.POLLING_INTERVAL,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
  });

  React.useEffect(() => {
    if (data) {
      const {post} = data;
      setLatestPostsByUser(post);
    }
  }, [data]);
};

export default usePollLatestPostsByUser;
