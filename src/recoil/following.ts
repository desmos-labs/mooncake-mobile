import {useEffect} from 'react';
import {
  atom,
  selector,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import {useQuery} from '@apollo/client';
import GetFollowedUsersForAddress, {
  GetFollowedUsersForAddressData,
} from 'services/graphql/queries/GetFollowedUsersForAddress';
import useActiveAccount from 'hooks/useActiveAccount';
import usePendingRelationships, {
  pendingRelationshipsState,
} from '@recoil/pendingTx/pendingRelationships';
import EnvConfig from 'config/EnvConfig';

export const followingState = atom<CounterParty[]>({
  key: 'following',
  default: [],
});

export const followedAddressesState = selector({
  key: 'followedAddressesState',
  get: ({get}) => {
    const following = get(followingState);
    return new Set(following.map(f => f.address));
  },
});

export const isFollowingAddr = selectorFamily({
  key: 'isFollowingAddr',
  get:
    (address: string) =>
    ({get}) => {
      const followedAddresses = get(followedAddressesState);

      return followedAddresses.has(address);
    },
});

/**
 * Get the list of followed accounts for the active account
 */
export const useGetFollowingPolling = () => {
  const {activeAddress} = useActiveAccount();
  const [, setFollowing] = useRecoilState(followingState);
  const {syncPendingRelationships} = usePendingRelationships();
  const pendingRelationships = useRecoilValue(pendingRelationshipsState);

  const {data, startPolling, stopPolling} =
    useQuery<GetFollowedUsersForAddressData>(GetFollowedUsersForAddress, {
      variables: {
        userAddress: activeAddress,
      },
      fetchPolicy: 'no-cache',
    });

  useEffect(() => {
    if (!data) return;
    const {user_relationship} = data;

    const newFollowing = user_relationship
      .map(x => x.counterparty)
      .filter(d => !!d);

    setFollowing(newFollowing);

    syncPendingRelationships(newFollowing.map(x => x.address));
  }, [data]);

  useEffect(() => {
    if (pendingRelationships.length > 0) {
      startPolling(EnvConfig.POLLING_INTERVAL);
    } else {
      stopPolling();
    }
  }, [pendingRelationships.length]);
};
