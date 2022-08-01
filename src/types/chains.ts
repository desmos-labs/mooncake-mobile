import {ChainConfig} from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_chain_links';
import {ImageSourcePropType} from 'react-native';
import {
  akashIcon,
  bandIcon,
  cosmosIcon,
  cryptoComIcon,
  eMoneyIcon,
  junoIcon,
  kavaIcon,
  likecoinIcon,
  osmosisIcon,
  regenIcon,
  terraIcon,
} from 'assets/images';
import {
  BandHdPath,
  CosmosHdPath,
  CroHdPath,
  HdPath,
  KavaHdPath,
  LunaHdPath,
} from './hdpath';

export enum ChainAccountType {
  Local,
  Ledger,
}

export type ChainId = 'desmos-mainnet' | 'morpheus-apollo-2';

export interface ChainAccount {
  /**
   * Account type.
   * Can be a local account or an
   * account imported from an external device like Ledger.
   */
  type: ChainAccountType;
  /**
   * The bech32 address of this account.
   */
  address: string;
  /**
   * The derivation path used to generate this account.
   */
  hdPath: HdPath;
  /**
   * Base64 encoded public key.
   */
  pubKey: string;
  /**
   * Algorithm used to sign a transaction.
   */
  signAlgorithm: 'secp256k1' | 'ed25519' | 'sr25519';
}

/**
 * Type that represents a chain that can be
 * linked to a desmos profile.
 */
export type LinkableChain = {
  /**
   * Chain name.
   */
  name: string;
  /**
   * The chain bech32 prefix.
   */
  prefix: string;
  /**
   * HD path used to derive the keys.
   */
  hdPath: HdPath;
  /**
   * Chain icon.
   */
  icon: ImageSourcePropType;
  /**
   * Chain configurations.
   */
  chainConfig: ChainConfig;
};

export const LinkableChains: LinkableChain[] = [
  {
    name: 'Akash',
    prefix: 'akash',
    hdPath: CosmosHdPath,
    icon: akashIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'akash',
    }),
  },
  {
    name: 'Band',
    prefix: 'band',
    hdPath: BandHdPath,
    icon: bandIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'band',
    }),
  },
  {
    name: 'Cosmos Hub',
    prefix: 'cosmos',
    hdPath: CosmosHdPath,
    icon: cosmosIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'cosmos',
    }),
  },
  {
    name: 'Crypto.org',
    prefix: 'cro',
    hdPath: CroHdPath,
    icon: cryptoComIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'crypto.org',
    }),
  },
  {
    name: 'e-Money',
    prefix: 'emoney',
    hdPath: CosmosHdPath,
    icon: eMoneyIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'emoney',
    }),
  },
  {
    name: 'Juno',
    prefix: 'juno',
    hdPath: CosmosHdPath,
    icon: junoIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'juno',
    }),
  },
  {
    name: 'Kava',
    prefix: 'kava',
    hdPath: KavaHdPath,
    icon: kavaIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'kava',
    }),
  },
  {
    name: 'Likecoin',
    prefix: 'cosmos',
    hdPath: CosmosHdPath,
    icon: likecoinIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'likecoin',
    }),
  },
  {
    name: 'Osmosis',
    prefix: 'osmo',
    hdPath: CosmosHdPath,
    icon: osmosisIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'osmosis',
    }),
  },
  {
    name: 'Regen',
    prefix: 'regen',
    hdPath: CosmosHdPath,
    icon: regenIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'regen',
    }),
  },
  {
    name: 'Terra',
    prefix: 'terra',
    hdPath: LunaHdPath,
    icon: terraIcon,
    chainConfig: ChainConfig.fromPartial({
      name: 'terra',
    }),
  },
];
