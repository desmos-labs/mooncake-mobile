import { useCallback, useState } from 'react';
import { Coin } from '@cosmjs/stargate';

/**
 * Hook that allows to get the fiat amount for a given balance.
 * @param balance The balance to get the fiat amount for.
 * TODO: Implement this
 */
const useBalanceFiatAmount = (balance: Coin[]) => {
  // TODO: Get the fiat to be used from the user.

  const [symbol, setSymbol] = useState<string>('$');
  const [amount, setAmount] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);
  const refetch = useCallback(async () => {}, []);

  return {
    symbol,
    amount,
    loading,
    refetch,
  };
};

export default useBalanceFiatAmount;
