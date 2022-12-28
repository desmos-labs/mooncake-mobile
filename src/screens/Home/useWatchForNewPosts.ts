import {useSubscription} from '@apollo/client';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import _ from 'lodash';
import {
  PostAggregateSubscription,
  PostAggregateSubscriptionFollowing,
} from 'services/graphql/subscriptions/PostAggregateSubscription';
import EnvConfig from 'config/EnvConfig';
import {useRecoilValue} from 'recoil';
import {followingState} from '@recoil/following';

const useWatchForNewPosts = () => {
  const [hasNewDiscoverPosts, setHasNewDiscoverPosts] =
    useState<boolean>(false);
  const [hasNewFollowingPosts, setHasNewFollowingPosts] =
    useState<boolean>(false);
  const following = useRecoilValue(followingState);

  const followingAddrs = useMemo(() => {
    return following.map(x => x.address);
  }, [JSON.stringify(following)]);

  const {data: postAggregateData} = useSubscription(PostAggregateSubscription, {
    fetchPolicy: 'no-cache',
    variables: {subspaceID: EnvConfig.APP_SUBSPACE_ID},
  });

  const {data: postAggregateFollowingData} = useSubscription(
    PostAggregateSubscriptionFollowing,
    {
      fetchPolicy: 'no-cache',
      variables: {
        subspaceID: EnvConfig.APP_SUBSPACE_ID,
        followingAddrs,
      },
    },
  );

  const storedPostAggregate = useRef<number>(0);
  const storedPostAggregateFollowing = useRef<number>(0);

  const processData = useCallback((aggregateData: any) => {
    return _.get(aggregateData, 'post_aggregate.aggregate.count');
  }, []);

  /**
   * Watch discover posts
   */
  useEffect(() => {
    const numPosts = processData(postAggregateData);

    if (numPosts && numPosts !== storedPostAggregate.current) {
      if (storedPostAggregate.current !== 0) {
        setHasNewDiscoverPosts(true);
      }

      storedPostAggregate.current = numPosts;
    }
  }, [JSON.stringify(postAggregateData), storedPostAggregate.current]);

  /**
   * Watch following posts
   */
  useEffect(() => {
    const numPosts = processData(postAggregateFollowingData);

    if (numPosts && numPosts !== storedPostAggregate.current) {
      if (storedPostAggregateFollowing.current !== 0) {
        setHasNewFollowingPosts(true);
      }

      storedPostAggregateFollowing.current = numPosts;
    }
  }, [
    JSON.stringify(storedPostAggregateFollowing),
    storedPostAggregateFollowing.current,
  ]);

  return {
    hasNewDiscoverPosts,
    setHasNewFollowingPosts,
    setHasNewDiscoverPosts,
    hasNewFollowingPosts,
  };
};

export default useWatchForNewPosts;
