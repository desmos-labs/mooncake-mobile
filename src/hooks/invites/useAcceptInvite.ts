import React from 'react';
import AcceptInvite from 'services/axios/requests/AcceptInvite';
import { ResultAsync } from 'neverthrow';

/**
 * Hook that allows to accept an invitation sent by another user and used to join Butter.
 */
const useAcceptInvite = () => {
  return React.useCallback((userAddress: string, inviteCode: string): ResultAsync<void, Error> => {
    return AcceptInvite(inviteCode).map(() => undefined);
  }, []);
};

export default useAcceptInvite;
