import {useSubscription} from '@apollo/client';
import UserPostAggregateSubscription from 'services/graphql/subscriptions/UserPostAggregateSubscription';
import EnvConfig from 'config/EnvConfig';
import useActiveAccount from 'hooks/useActiveAccount';
import {useCallback, useRef} from 'react';
import {useGetLatestPostsByActiveAddress} from '@recoil/latestPostsByUser';
import {OnDataOptions} from '@apollo/client/react/types/types';
import _ from 'lodash';

const useSubscribeToPostsByActiveAddress = () => {
  const {activeAddress} = useActiveAccount();

  const {getLatestPostsByActiveAddress} = useGetLatestPostsByActiveAddress();

  const savedPostCount = useRef<number>(0);

  const onData = useCallback(
    (options: OnDataOptions) => {
      const count = _.get(
        options,
        'data.data.post_aggregate.aggregate.count',
        0,
      );
      if (savedPostCount && savedPostCount.current !== count) {
        savedPostCount.current = count;
        getLatestPostsByActiveAddress();
      }
    },
    [savedPostCount?.current, getLatestPostsByActiveAddress],
  );

  useSubscription(UserPostAggregateSubscription, {
    variables: {
      subspaceID: EnvConfig.APP_SUBSPACE_ID,
      userAddress: activeAddress,
    },
    onData,
  });
};

export default useSubscribeToPostsByActiveAddress;
