import React from 'react';
import {atom, useRecoilState} from 'recoil';
import {useQuery} from '@apollo/client';
import GetFollowedUsersForAddress from 'services/graphql/queries/GetFollowedUsersForAddress';

export const followingState = atom<CounterParty[]>({
  key: 'following',
  default: [],
});

/**
 * Get the list of followed accounts for the active account
 */
export const useGetFollowing = () => {
  const [following, setFollowing] = useRecoilState(followingState);

  // The address of the user's active account
  // hardcoded for now, but it should be a recoil value in the future
  const userAddress = 'desmos1dx6h75tkj0cuvyqf6cwn6usc9qynu39v0245m4';

  const {data, refetch, loading} = useQuery(GetFollowedUsersForAddress, {
    pollInterval: 500,
    variables: {
      userAddress,
    },
    onCompleted: (result: any) => {
      const {user_relationship} = result;

      const mapped = user_relationship.map((x: any) => x.counterparty);

      setFollowing(mapped);
    },
    onError: error => {
      console.log(error);
    },
  });

  console.log(data);

  // refetch following list if userAddress has changed
  React.useEffect(() => {
    refetch({userAddress});
  }, [userAddress]);

  return {
    following,
    loading,
  };
};
