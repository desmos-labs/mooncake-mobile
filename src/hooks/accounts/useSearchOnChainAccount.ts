import GetAccountBalance from 'services/graphql/queries/GetAccountBalance';
import useCustomLazyQuery from 'hooks/graphql/useCustomLazyQuery';
import { useCallback } from 'react';
import { filterCoins } from 'lib/ChainsUtils';

/**
 * Hook that allows to search for an account on chain.
 */
const useSearchOnChainAccount = () => {
  const [getLazyData] = useCustomLazyQuery(GetAccountBalance);

  /**
   * @param address the address to search for.
   * @returns a boolean that tells whether the account has a balance or not (if the account is on chain or not).
   */
  return useCallback(
    async (address: string): Promise<boolean> => {
      const result = await getLazyData({
        variables: {
          address,
        },
      });

      return filterCoins(result.balance.coins).length > 0;
    },
    [getLazyData],
  );
};

export default useSearchOnChainAccount;
