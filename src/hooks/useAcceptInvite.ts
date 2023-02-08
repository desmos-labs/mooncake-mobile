import React from 'react';
import AcceptInvite from 'services/axios/requests/AcceptInvite';
import { err, ok, Result } from 'neverthrow';

export interface AcceptInviteSuccess {}

/**
 * Hook that allows to accept an invitation sent by another user and used to join Butter.
 */
const useAcceptInvite = () => {
  return React.useCallback(
    async (
      userAddress: string,
      inviteCode: string,
    ): Promise<Result<AcceptInviteSuccess, Error>> => {
      const response = await AcceptInvite(inviteCode);
      if (response.isErr()) {
        return err(response.error);
      }
      return ok({});
    },
    [],
  );
};

export default useAcceptInvite;
