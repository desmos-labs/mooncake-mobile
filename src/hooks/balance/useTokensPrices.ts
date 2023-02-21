import { Coin } from '@cosmjs/stargate';
import { convertGraphQLTokenPrice } from 'lib/GraphQLUtils/tokens';
import { findCurrencyByDenom } from 'lib/ChainsUtils';
import { safeParseFloat } from 'lib/FormatUtils';
import { TokenPrice } from 'types/tokens';
import { useQuery } from '@apollo/client';
import GetTokensPrices from 'services/graphql/queries/GetTokensPrices';

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

    // Find the exponent of the coin
    const currency = findCurrencyByDenom(coin.denom);
    const exponent = currency?.coinDecimals ?? 0;

    // Compute the difference between the token price exponent, and the coin exponent
    const exponentDiff = (tokenPrice?.exponent ?? exponent) - exponent;

    // Multiply the coin amount to the 10^exponentDiff, in order to get the correct amount
    const amount = safeParseFloat(coin.amount) * 10 ** exponentDiff;

    // Get the price by multiplying the amount by the price
    const price = amount * (tokenPrice?.price ?? 0);

    return {
      price,
      exponent,
      denom: coin.denom,
    } as TokenPrice;
  });
};

/**
 * Hook that allows to get the price of a given token.
 * @param coins The coins to get the price for.
 */
const useTokensPrices = (coins: Coin[]) => {
  const { data, refetch, loading } = useQuery(GetTokensPrices);
  return {
    prices: getPrices(data, coins),
    loading,
    refetch,
  };
};

export default useTokensPrices;
