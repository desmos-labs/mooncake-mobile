import { Coin } from '@cosmjs/stargate';
import useTokensPrices from 'hooks/balance/useTokensPrices';

/**
 * Hook that allows to get the fiat amount for a given balance.
 * @param balance The balance to get the fiat amount for.
 */
const useBalanceFiatAmount = (balance: Coin[]) => {
  const { prices, loading, refetch: refetchPrices } = useTokensPrices(balance);

  return {
    // Currently the APIs allow to get only the price in USD.
    symbol: '$',
    amount: prices.map(p => p.price).reduce((a, b) => a + b, 0),
    loading,
    refetch: refetchPrices,
  };
};

export default useBalanceFiatAmount;
