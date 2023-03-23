import _ from 'lodash';
import React, { useMemo } from 'react';
import { useActiveAccountAddress } from '@recoil/accounts';
import useGetActiveAccountInvites from 'hooks/invites/useInvites';

const useGetSectionedInvites = () => {
  const activeAddress = useActiveAccountAddress();
  const {
    invites,
    loading: loadingInvites,
    refetch: refetchInvites,
    error: errorInvites,
  } = useGetActiveAccountInvites();

  const sectionedInvites = useMemo(() => {
    let rewardBalance = 0;

    const filteredInvitesWithoutSelfInvite =
      invites?.filter(invite => invite?.claimerAddress !== activeAddress) ?? [];

    const hasBeenInvited =
      invites?.find(invite => invite.claimerAddress === activeAddress) ?? false;

    if (hasBeenInvited) {
      rewardBalance += 2;
    }

    const [successful, pending] = _.partition(
      filteredInvitesWithoutSelfInvite,
      invite => invite.claimerAddress !== undefined,
    );

    rewardBalance += successful.length * 2;

    return {
      rewardBalance,
      claimedInvites: successful,
      pendingInvites: pending,
    };
  }, [activeAddress, invites]);

  const refetch = React.useCallback(() => {
    refetchInvites();
  }, [refetchInvites]);

  const error = React.useMemo(() => {
    return errorInvites;
  }, [errorInvites]);

  return {
    ...sectionedInvites,
    loading: loadingInvites,
    refetch,
    error,
  };
};

export default useGetSectionedInvites;
