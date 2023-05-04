import React, { useMemo, useState } from 'react';
import { err, ok, Result } from 'neverthrow';
import { useQuery } from '@apollo/client';
import GetAccountBalance from 'services/graphql/queries/GetAccountBalance';
import { filterCoins } from 'lib/ChainsUtils';

/**
 * Tells whether the given data contains a balance.
 * @param data {any} - Data retrieved from the GraphQL APIs.
 */
const hasBalance = (data: any | undefined): boolean => {
  const balance = data?.balance?.coins || [];
  return filterCoins(balance).length > 0;
};

/**
 * Hook that is used in order to observe the changes to the account balance of a particular user.
 * @param pollInterval {number} - Milliseconds that define the interval of the balance polling.
 * @param timeout {number} - Milliseconds after which this function will timeout in order to prevent infinite polling.
 */
const useWaitForAccountBalance = (pollInterval: number = 1000, timeout: number = 30 * 1000) => {
  // Reference to the address to check. This is done because this function
  // returns a hook, which should allow setting the address later on
  const [addressToCheck, setAddressToCheck] = useState<string>('');

  // Get a reference to the function that will be used to accept the returned promise
  const accept = React.useRef<(result: Result<void, Error>) => void>(() => {});

  // Build a promise that will be returned by this hook.
  // This is built here, before the query, in order to avoid mistakenly
  // calling a non-set accept function when we execute the first
  // GetAccountBalance query later on
  const promise = useMemo(
    () =>
      new Promise<Result<void, Error>>(a => {
        accept.current = a;
      }),
    [],
  );

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
        accept.current(err(new Error('Request timeout')));
      }, timeout),
    [stopPolling, timeout],
  );

  // Observe the changes in the data field, and accept the promise as
  // soon as there is some balance within the account
  React.useEffect(() => {
    if (hasBalance(data)) {
      clearTimeout(t);
      stopPolling();
      accept.current(ok(undefined));
    }
  }, [data, stopPolling, t]);

  return React.useCallback(
    (address: string) => {
      setAddressToCheck(address);
      startPolling(pollInterval);
      return promise;
    },
    [pollInterval, promise, startPolling],
  );
};

export default useWaitForAccountBalance;
