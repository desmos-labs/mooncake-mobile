import React from 'react';
import {atom, useRecoilState} from 'recoil';
import {useQuery} from '@apollo/client';
import GetFollowedUsersForAddress, {
  GetFollowedUsersForAddressData,
} from 'services/graphql/queries/GetFollowedUsersForAddress';
import useActiveAccount from 'hooks/useActiveAccount';

export const followingState = atom<CounterParty[]>({
  key: 'following',
  default: [],
});

/**
 * Get the list of followed accounts for the active account
 */
export const useGetFollowing = () => {
  const {activeAddress} = useActiveAccount();
  const [following, setFollowing] = useRecoilState(followingState);

  const {refetch, loading} = useQuery<GetFollowedUsersForAddressData>(
    GetFollowedUsersForAddress,
    {
      variables: {
        userAddress: activeAddress,
      },
      pollInterval: 2000,
      fetchPolicy: 'no-cache',
      onCompleted: result => {
        const {user_relationship} = result;

        const mapped = user_relationship
          .map(x => x.counterparty)
          .filter(d => !!d);

        setFollowing(mapped);
      },
      onError: error => {
        console.log(error);
      },
    },
  );

  // refetch following list if userAddress has changed
  React.useEffect(() => {
    refetch({userAddress: activeAddress});
  }, [activeAddress]);

  return {
    following,
    loading,
  };
};
