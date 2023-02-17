import React, { useCallback } from 'react';
import { useActiveAccountAddress } from '@recoil/accounts';
import useButterConfig from 'hooks/useButterConfig';
import GenerateInvite from 'services/axios/requests/GenerateInvite';
import { ResultAsync } from 'neverthrow';
import useGetActiveAccountInvites from 'hooks/useGetInvites';
import useAccountImpactPoints from 'hooks/useAccountImpactPoints';

export interface InvitesInfo {
  /**
   * Number of invites that the user have generated.
   */
  generatedInvites: number;
  /**
   * Number of invites that can be generated from the user.
   */
  generableInvitesCount: number;
  /**
   * Amount of impact points required to generate an invite.
   */
  requiredImpactPoints: number;
  /**
   * Amount of impact points that currently the user have.
   */
  userImpactPoints: number;
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
  const {
    impactPoints,
    loading: loadingImpactPoints,
    refetch: refetchImpactPoints,
  } = useAccountImpactPoints();

  // Merge the refetch functions.
  const refetch = React.useCallback(() => {
    refetchButterConfig();
    refetchInvites();
    refetchImpactPoints();
  }, [refetchButterConfig, refetchImpactPoints, refetchInvites]);

  const invitesInfo = React.useMemo<InvitesInfo | undefined>(() => {
    if (
      loadingButterConfig ||
      loadingInvites ||
      loadingImpactPoints ||
      butterConfig === undefined
    ) {
      return undefined;
    }

    // Impact points obtained from the user.
    const userImpactPoints = impactPoints ?? 0;

    // Computes the number of invites generated from the user.
    const generatedInvites = invitesData!.filter(
      invite => invite.claimerAddress !== activeAddress,
    ).length;

    // Compute the number of invites that this user can generate.
    const generableInvitesCount = butterConfig.invites.requiredImpactPoints.length;

    // Get the points to generate an invite
    let requiredImpactPoints: number;
    if (generatedInvites < generableInvitesCount) {
      requiredImpactPoints = butterConfig.invites.requiredImpactPoints[generatedInvites];
    } else {
      requiredImpactPoints = NaN;
    }

    return {
      generatedInvites,
      generableInvitesCount,
      requiredImpactPoints,
      userImpactPoints,
    };
  }, [
    loadingInvites,
    loadingButterConfig,
    loadingImpactPoints,
    impactPoints,
    butterConfig,
    invitesData,
    activeAddress,
  ]);

  return {
    loading: loadingInvites || loadingButterConfig || loadingImpactPoints,
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
