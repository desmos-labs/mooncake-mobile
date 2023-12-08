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

/**
 * Find the currency with the given {@param denom} inside the list of currencies of the supported chains.
 */
export const findCurrencyByDenom = (denom: string) => {
  return SupportedChains.flatMap(chain => chain.chainInfo ?? [])
    .flatMap(info => info.currencies ?? [])
    .find(value => value.coinDenom === denom);
};

/**
 * Finds the coin with the given {@param denom} in the given {@param coins} array.
 */
export const findCoinByDenom = (coins: Coin[], denom: string) => {
  return coins.find(coin => coin.denom === denom);
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
