import React, { useState } from 'react';
import AcceptInvite from 'services/axios/requests/AcceptInvite';
import { err, ok, Result } from 'neverthrow';
import { useQuery } from '@apollo/client';
import GetAccountBalance from 'services/graphql/queries/GetAccountBalance';

export interface AcceptInviteSuccess {}

const hasBalance = (data: any | undefined): boolean => {
  return (
    data &&
    data?.action_account_balance?.coins?.length > 0 &&
    data?.action_account_balance?.coins[0]?.amount !== 0
  );
};

const useWaitForAccountBalance = (pollInterval: number = 1000, timeout: number = 30 * 1000) => {
  // Reference to the address to check. This is done because this function
  // returns a hook, which should allow setting the address later on
  const [addressToCheck, setAddressToCheck] = useState<string>('');

  // Get a reference to the function that will be used to accept the returned promise
  const accept = React.useRef<(result: Result<AcceptInviteSuccess, Error>) => void>(() => {});

  // Build a promise that will be returned by this hook.
  // This is built here, before the query, in order to avoid mistakenly
  // calling a non-set accept function when we execute the first
  // GetAccountBalance query later on
  const promise = new Promise<Result<AcceptInviteSuccess, Error>>(a => {
    accept.current = a;
  });

  // Start the polling of the data
  const { data, startPolling, stopPolling } = useQuery(GetAccountBalance, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    variables: {
      address: addressToCheck,
    },
  });

  // Build a timeout so that we do not wait forever
  const t = React.useMemo(
    () =>
      setTimeout(() => {
        stopPolling();
        accept.current(err(new Error('Accept invite request timeout')));
      }, timeout),
    [],
  );

  // Observe the changes in the data field, and accept the promise as
  // soon as there is some balance within the account
  React.useEffect(() => {
    if (hasBalance(data)) {
      clearTimeout(t);
      stopPolling();
      accept.current(ok({} as AcceptInviteSuccess));
    }
  }, [data]);

  return React.useCallback((address: string) => {
    setAddressToCheck(address);
    startPolling(pollInterval);
    return promise;
  }, []);
};

/**
 * Hook that allows to accept an invitation.
 * After accepting the invitation, this hook will start listening to
 * changes in the balance of the account that has accepted the invitation.
 *
 * If the account receives some tokens in the next 30 seconds, then a
 * {@link AcceptInviteSuccess} instance is returned.
 *
 * If the account does not receive any token before the given {@param timeout},
 * an error will be returned.
 *
 * If any error is raised, it will be returned as well.
 *
 * @param pollInterval {number} - Optional polling interval (default: 1 second)
 * @param timeout {number} - Optional number of seconds after which to stop the
 * polling and return a timeout error.
 */
const useAcceptInvite = (pollInterval: number = 1000, timeout: number = 30 * 1000) => {
  const waitForAccountBalance = useWaitForAccountBalance(pollInterval, timeout);
  return React.useCallback(
    async (userAddress: string, inviteCode: string) => {
      const response = await AcceptInvite(inviteCode);
      if (!response) {
        return err(new Error('Accept invite request error'));
      }
      return waitForAccountBalance(userAddress);
    },
    [waitForAccountBalance],
  );
};

export default useAcceptInvite;
