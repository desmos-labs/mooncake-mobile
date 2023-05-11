import React from 'react';
import { useActiveAccountAddress } from '@recoil/accounts';
import useGetOnChainProfile from 'hooks/profiles/useGetOnChainProfile';
import useCustomLazyQuery from 'hooks/graphql/useCustomLazyQuery';
import { useAppStateValue } from '@recoil/appState';
import useUpdateBlockedRelationshipCache from 'hooks/relationships/blocked/useUpdateBlockedRelationshipCache';
import GetBlockedForAddress from 'services/graphql/queries/GetBlockedForAddress';

/**
 * Hook that allows to update the cache of the blocked relationships for the currently active user.
 */
const useRefreshBlockedRelationshipCache = () => {
  const activeAccountAddress = useActiveAccountAddress();

  const subspaceId = useAppStateValue('subspaceId');

  const getProfile = useGetOnChainProfile();
  const [getLazyData] = useCustomLazyQuery(GetBlockedForAddress);

  const updateBlockedRelationshipCache = useUpdateBlockedRelationshipCache();

  return React.useCallback(
    async (counterparty: string) => {
      if (!activeAccountAddress) {
        throw new Error('Cannot update the relationships cache without an active account');
      }

      // Skip if the counterparty is the same as the active account
      if (counterparty === activeAccountAddress) {
        return;
      }

      const counterpartyProfile = await getProfile(counterparty);
      if (!counterpartyProfile) {
        // Skip all relationships with people that do not have a profile
        return;
      }

      // Get the relationship existence from the server
      const data = await getLazyData({
        variables: {
          subspaceId,
          blockerAddress: activeAccountAddress,
          blockedAddress: counterparty,
        },
      });
      const isBlocked = data?.user_block?.length > 0;

      // Update the cache
      updateBlockedRelationshipCache(activeAccountAddress, counterpartyProfile, isBlocked);
    },
    [activeAccountAddress, getLazyData, getProfile, subspaceId, updateBlockedRelationshipCache],
  );
};

export default useRefreshBlockedRelationshipCache;
