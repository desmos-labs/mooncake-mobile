import {ChainConfig} from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_chain_links';
import {ImageSourcePropType} from 'react-native';
import {HdPath} from './hdpath';

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

  /**
   * The chain's related assets
   */
  assets?: ChainAsset[];
};
