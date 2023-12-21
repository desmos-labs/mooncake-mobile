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
