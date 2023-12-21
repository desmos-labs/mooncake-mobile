import { useQuery } from '@apollo/client';
import { Coin } from '@cosmjs/stargate';
import { safeParseFloat } from 'lib/FormatUtils';
import { convertGraphQLTokenPrice } from 'lib/GraphQLUtils/tokens';
import React from 'react';
import GetTokensPrices from 'services/graphql/queries/GetTokensPrices';
import { TokenPrice } from 'types/tokens';

/**
 * Get the prices of a given list of coins from the GraphQL data.
 * @param data The GraphQL data.
 * @param coins The coin to get the price for.
 */
const getPrices = (data: any, coins: Coin[]) => {
  const prices = convertGraphQLTokenPrice(data);

  return coins.map(coin => {
    // Sort the prices based on their exponent (descending) and return the first one that is not zero
    const tokenPrice = prices.sort((a, b) => a.exponent - b.exponent).find(p => p.price > 0);

    // Multiply the coin amount to the 10^exponentDiff, in order to get the correct amount
    const amount = safeParseFloat(coin.amount) / 10 ** (tokenPrice?.exponent ?? 0);

    // Get the price by multiplying the amount by the price
    const price = amount * (tokenPrice?.price ?? 0);
    return {
      price,
      denom: coin.denom,
    } as TokenPrice;
  });
};

/**
 * Hook that allows to get the price of a given token.
 * @param coins The coins to get the price for.
 */
const useTokensPrices = (coins: Coin[]) => {
  const { data, refetch, loading } = useQuery(GetTokensPrices, {
    variables: {
      denoms: coins.map(coin => coin.denom),
    },
  });

  const prices = React.useMemo(() => {
    return getPrices(data, coins);
  }, [data, coins]);

  return {
    prices,
    loading,
    refetch,
  };
};

export default useTokensPrices;
