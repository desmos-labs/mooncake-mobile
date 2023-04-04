import React from 'react';
import { useActiveAccountAddress } from '@recoil/accounts';
import useGetOnChainProfile from 'hooks/profiles/useGetOnChainProfile';
import useCustomLazyQuery from 'hooks/graphql/useCustomLazyQuery';
import GetRelationshipForAddress from 'services/graphql/queries/GetRelationshipForAddress';
import { useAppStateValue } from '@recoil/appState';
import useUpdateRelationshipCache from 'hooks/relationships/useUpdateRelationshipCache';

/**
 * Hook that allows to update the cache of the relationships for the currently active user.
 */
const useRefreshRelationshipCache = () => {
  const activeAccountAddress = useActiveAccountAddress();

  const subspaceId = useAppStateValue('subspaceId');

  const getProfile = useGetOnChainProfile();
  const [getLazyData] = useCustomLazyQuery(GetRelationshipForAddress);

  const updateRelationshipCache = useUpdateRelationshipCache();

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
          userAddress: activeAccountAddress,
          counterpartyAddress: counterparty,
        },
      });
      const isFollowing = data?.relationships?.length > 0;

      // Update the cache
      updateRelationshipCache(activeAccountAddress, counterpartyProfile, isFollowing);
    },
    [activeAccountAddress, getLazyData, getProfile, subspaceId, updateRelationshipCache],
  );
};

export default useRefreshRelationshipCache;
