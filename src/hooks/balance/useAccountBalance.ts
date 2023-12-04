import React, { useState } from 'react';
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
  const { refetch, loading, data } = useQuery(GetAccountBalance, {
    variables: { address: userAddress },
  });

  // Update the balance based on when the data from the server changes
  React.useEffect(() => {
    if (!data) return;

    const { balance: onChainBalance } = data;
    setBalance(onChainBalance.coins);
  }, [data]);

  return {
    balance: filterCoins(balance),
    loading,
    refetch,
  };
};

export default useAccountBalance;
