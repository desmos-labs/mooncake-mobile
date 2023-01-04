import {useSubscription} from '@apollo/client';
import UserPostAggregateSubscription from 'services/graphql/subscriptions/UserPostAggregateSubscription';
import EnvConfig from 'config/EnvConfig';
import useActiveAccount from 'hooks/useActiveAccount';
import {useEffect, useRef} from 'react';
import {useGetLatestPostsByActiveAddress} from '@recoil/latestPostsByUser';

const useSubscribeToPostsByActiveAddress = () => {
  const {activeAddress} = useActiveAccount();

  const {getLatestPostsByActiveAddress} = useGetLatestPostsByActiveAddress();

  const savedPostCount = useRef<number>(0);

  const {data} = useSubscription(UserPostAggregateSubscription, {
    variables: {
      subspaceID: EnvConfig.APP_SUBSPACE_ID,
      userAddress: activeAddress,
    },
  });

  useEffect(() => {
    if (!data) return;

    const {
      post_aggregate: {
        aggregate: {count},
      },
    } = data;

    if (savedPostCount.current !== count) {
      savedPostCount.current = count;
      getLatestPostsByActiveAddress();
    }
  }, [
    JSON.stringify(data),
    savedPostCount.current,
    getLatestPostsByActiveAddress,
  ]);
};

export default useSubscribeToPostsByActiveAddress;
