import { useState } from 'react';
import { useQuery } from '@apollo/client';
import GetAccountBalance from 'services/graphql/queries/GetAccountBalance';
import { Coin } from '@cosmjs/stargate';
import { useActiveAccountAddress } from '@recoil/accounts';
import { filterCoins } from 'lib/ChainsUtils';

/**
 * Hook that allows to get the current balance for an account.
 * @param address {string} - Address of the account for which to get the balance.
 * If no address is specified, the current application account address will be used instead.
 */
const useAccountBalance = (address?: string) => {
  const activeAddress = useActiveAccountAddress();
  const userAddress = address || activeAddress;
  if (!userAddress) {
    throw new Error('Cannot get account balance of undefined address');
  }

  const [balance, setBalance] = useState<Coin[]>([]);
  const [error, setError] = useState<Error>();
  const { refetch, loading } = useQuery(GetAccountBalance, {
    fetchPolicy: 'network-only',
    variables: { address: userAddress },
    onCompleted(data) {
      const { balance: onChainBalance } = data;
      setBalance(onChainBalance.coins);
    },
    onError(e) {
      setError(e);
    },
  });

  return {
    balance: filterCoins(balance),
    error,
    loading,
    refetch,
  };
};

export default useAccountBalance;
