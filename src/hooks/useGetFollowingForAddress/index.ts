import { useSetRecoilState } from 'recoil';
import { useLazyQuery } from '@apollo/client';
import GetFollowedUsersForAddress, {
  GetFollowedUsersForAddressData,
} from 'services/graphql/queries/GetFollowedUsersForAddress';
import { useCallback } from 'react';
import _ from 'lodash';
import { followingState } from '@recoil/following';

/**
 * A hook that exposes a function to manually update a user's following list.
 */
const useGetFollowingForAddress = (address: string) => {
  const setFollowing = useSetRecoilState(followingState);

  const [, { refetch }] = useLazyQuery<GetFollowedUsersForAddressData>(GetFollowedUsersForAddress, {
    variables: {
      userAddress: address,
    },
    fetchPolicy: 'no-cache',
  });

  const updateFollowing = useCallback(async () => {
    const { data } = await refetch({ userAddress: address });
    const { user_relationship } = data;

    const newFollowing = user_relationship.map(x => x.counterparty);

    setFollowing(_.compact(newFollowing));
  }, [address]);

  return {
    updateFollowing,
  };
};

export default useGetFollowingForAddress;
