import { Coin } from '@cosmjs/stargate';
import { DesmosMainnet, DesmosTestnet } from '@desmoslabs/desmjs';
import { SupportedChains } from 'config/LinkableChains';

/**
 * Finds the chain info with the given {@param chainName} inside the supported chains.
 */
export const findChainInfoByName = (chainName: string) => {
  return SupportedChains.flatMap(chain => chain.chainInfo).find(
    info => info?.chainName === chainName,
  );
};

const supportedBalanceDenoms = [DesmosMainnet, DesmosTestnet]
  .flatMap(chain => chain.currencies ?? [])
  .map(currency => currency.coinMinimalDenom);

/**
 * Filters the given {@param coins} array, returning only the coins that are supported by the app.
 */
export const filterCoins = (coins: Coin[] | []): Coin[] => {
  return coins?.filter(coin => supportedBalanceDenoms.includes(coin.denom));
};

/**
 * Returns the coin denom associated to the given {@param minimalDenom}.
 * @param minimalDenom The minimal denom to use to find the coin denom.
 */
export const getCoinDenomByMinimalDenom = (minimalDenom: string): string => {
  // The default denom will be the minimal denom without the first character (usually 'u') and everything caps
  const defaultDenom = minimalDenom.slice(1).toUpperCase();

  // Search inside the supported chains for the coin denom
  return (
    SupportedChains.flatMap(chain => chain.chainInfo)
      .flatMap(info => info?.currencies ?? [])
      .find(currency => currency.coinMinimalDenom === minimalDenom)?.coinDenom ?? defaultDenom
  );
};
