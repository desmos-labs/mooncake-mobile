import React, { useCallback } from 'react';
import { useActiveAccountAddress } from '@recoil/accounts';
import useButterConfig from 'hooks/config/useButterConfig';
import GenerateInvite from 'services/axios/requests/GenerateInvite';
import { ResultAsync } from 'neverthrow';
import useGetActiveAccountInvites from 'hooks/invites/useInvites';

export interface InvitesInfo {
  /**
   * Number of invites that the user have generated.
   */
  generatedInvites: number;
}

/**
 * Hook that provides the information relative about the number of
 * generated invites and the amount of impact points required to generate
 * an invitation link.
 */
export const useGetActiveAccountInvitesInfo = () => {
  const activeAddress = useActiveAccountAddress();
  const {
    config: butterConfig,
    loading: loadingButterConfig,
    refetch: refetchButterConfig,
  } = useButterConfig();
  const {
    invites: invitesData,
    loading: loadingInvites,
    refetch: refetchInvites,
  } = useGetActiveAccountInvites();

  // Merge the refetch functions.
  const refetch = React.useCallback(() => {
    refetchButterConfig();
    refetchInvites();
  }, [refetchButterConfig, refetchInvites]);

  const invitesInfo = React.useMemo<InvitesInfo | undefined>(() => {
    if (loadingButterConfig || loadingInvites || butterConfig === undefined) {
      return undefined;
    }

    // Computes the number of invites generated from the user.
    const generatedInvites = invitesData!?.filter(
      invite => invite.claimerAddress !== activeAddress,
    ).length;

    return {
      generatedInvites,
    };
  }, [loadingInvites, loadingButterConfig, butterConfig, invitesData, activeAddress]);

  return {
    loading: loadingInvites || loadingButterConfig,
    invitesInfo,
    refetch,
  };
};

/**
 * Hook that provides a function to generate an invitation link.
 */
export const useGenerateInvite = () => {
  return useCallback(async () => {
    return ResultAsync.fromPromise(GenerateInvite(), e =>
      Error((<Partial<Error> | undefined>e)?.message ?? 'Error generating the invite'),
    ).map(response => response.link);
  }, []);
};
