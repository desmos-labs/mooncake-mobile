import useActiveAccount from 'hooks/useActiveAccount';
import {useSubscription} from '@apollo/client';
import {useEffect, useRef} from 'react';
import _ from 'lodash';
import SubUserRelationshipCounterPartyAddr from 'services/graphql/subscriptions/SubUserRelationshipCounterPartyAddr';
import {useGetFollowingForAddress} from '@recoil/following';
import useOptimisticRelationships from '@recoil/optimisticUI/optimisticRelationships';

const useSubscribeToUserFollowingChanges = () => {
  const {activeAddress} = useActiveAccount();
  const {updateFollowing} = useGetFollowingForAddress(activeAddress!);
  const {data} = useSubscription(SubUserRelationshipCounterPartyAddr, {
    variables: {
      address: activeAddress,
    },
    // no-cache is required as caching the result causes it to never update
    fetchPolicy: 'no-cache',
  });

  const {resolveOptimisticRelationships} = useOptimisticRelationships();

  const storedFollowing = useRef<string>('');

  useEffect(() => {
    const counterPartyArr: {counterparty_address: string}[] = _.get(
      data,
      'user_relationship',
    );

    if (!counterPartyArr) return;
    const followingCount = counterPartyArr.filter(
      x => x.counterparty_address,
    ).length;

    if (
      followingCount &&
      JSON.stringify(counterPartyArr) !== storedFollowing.current
    ) {
      updateFollowing().then(() => {
        // update existing counter, make API call to update user's following list
        storedFollowing.current = JSON.stringify(counterPartyArr);
        return resolveOptimisticRelationships();
      });
    }
  }, [JSON.stringify(data), storedFollowing.current]);
};

export default useSubscribeToUserFollowingChanges;
