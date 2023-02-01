import React, {useState} from 'react';
import AcceptInvite from 'services/axios/requests/AcceptInvite';
import {useQuery} from '@apollo/client';
import GetAccountBalance from 'services/graphql/queries/GetAccountBalance';

export interface Params {
  readonly invitee: string;
  readonly inviteCode: string;
  readonly onSuccess: () => void;
  readonly onTimeout: () => void;
  readonly onError: (error: Error) => void;
}

/**
 * Hook that allows to accept an invitation.
 * After accepting the invitation, this hook will start listening to
 * changes in the balance of the account that has accepted the invitation.
 *
 * If the account receives some tokens in the next 30 seconds, then
 * {@code onSuccess} is called.
 *
 * If the account does not receive any token before the given {@param timeout},
 * {@code onTimeout} is called instead.
 *
 * If any error is raised, {@code onError} is called.
 *
 * @param pollInterval {number} - Optional polling interval (default: 1 second)
 * @param timeout {number} - Optional number of seconds after which to stop the
 * polling and calling {@code onTimeout} (default: 30 seconds)
 */
const useAcceptInvite = (
  pollInterval: number = 1000,
  timeout: number = 30 * 1000,
) => {
  const [addressToCheck, setAddressToCheck] = useState<string>('');

  const [, setTries] = useState<number>(0);
  const [onSuccess, setOnSuccess] = useState<Function>(() => {});
  const [onTimeout, setOnTimeout] = useState<Function>(() => {});

  const {data, startPolling, stopPolling} = useQuery(GetAccountBalance, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    variables: {
      address: addressToCheck,
    },
  });

  // React to the data changes to properly call onSuccess or onError
  React.useEffect(() => {
    setTries(value => {
      const updatedValue = value + 1;
      if (updatedValue >= timeout / pollInterval) {
        // After too many tries, stop the polling
        stopPolling();
        onTimeout();
      }
      return updatedValue;
    });

    if (
      data &&
      data?.action_account_balance?.coins?.length > 0 &&
      data?.action_account_balance?.coins[0]?.amount !== 0
    ) {
      stopPolling();
      onSuccess();
    }
  }, [data]);

  return React.useCallback(async (params: Params) => {
    const response = await AcceptInvite(params.inviteCode);
    if (response) {
      params.onError(new Error('Accept invite failed'));
      return;
    }

    setOnSuccess(params.onSuccess);
    setOnTimeout(params.onTimeout);
    setAddressToCheck(params.invitee);
    startPolling(pollInterval);
  }, []);
};

export default useAcceptInvite;
