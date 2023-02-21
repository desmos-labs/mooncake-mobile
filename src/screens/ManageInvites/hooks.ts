import _ from 'lodash';
import React, { useMemo } from 'react';
import { useActiveAccountAddress } from '@recoil/accounts';
import useGetActiveAccountInvites from 'hooks/invites/useInvites';
import useButterConfig from 'hooks/config/useButterConfig';

export const useGetSectionedInvites = () => {
  const activeAddress = useActiveAccountAddress();
  const {
    invites,
    loading: loadingInvites,
    refetch: refetchInvites,
    error: errorInvites,
  } = useGetActiveAccountInvites();
  const {
    config,
    loading: loadingButterConfig,
    refetch: refetchConfig,
    error: errorButterConfig,
  } = useButterConfig();

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

  const maxInvitations = useMemo(() => {
    return config?.invites.requiredImpactPoints.length ?? 0;
  }, [config]);

  const refetch = React.useCallback(() => {
    refetchInvites();
    refetchConfig();
  }, [refetchConfig, refetchInvites]);

  const error = React.useMemo(() => {
    return errorInvites ?? errorButterConfig;
  }, [errorButterConfig, errorInvites]);

  return {
    ...sectionedInvites,
    maxInvitations,
    loading: loadingInvites || loadingButterConfig,
    refetch,
    error,
  };
};
