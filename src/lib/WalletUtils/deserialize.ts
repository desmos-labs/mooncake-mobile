import {
  SerializablePrivateKeyWallet,
  SerializableWallet,
  SerializableWeb3AuthWallet,
  WalletType,
} from 'types/wallet';

/**
 * Deserialize a [SerializableWeb3AuthWallet] from a JSON parsed object.
 * @param value - The JSON parsed value that should be a [SerializableWeb3AuthWallet].
 */
export const deserializeWeb3AuthWallet = (
  value: Partial<SerializableWeb3AuthWallet>,
): SerializableWeb3AuthWallet => {
  if (
    value.version === undefined ||
    value.type === undefined ||
    value.address === undefined ||
    value.privateKey === undefined ||
    value.loginProvider === undefined ||
    value.addressPrefix === undefined
  ) {
    throw new Error('invalid serialized web3auth wallet');
  }

  if (value.type !== WalletType.Web3Auth) {
    throw new Error(`invalid web3auth wallet wallet type: ${value.type}`);
  }

  // Skip version check, at the moment we just have one version.
  return {
    version: value.version,
    type: value.type,
    address: value.address,
    privateKey: value.privateKey,
    loginProvider: value.loginProvider,
    addressPrefix: value.addressPrefix,
  };
};

/**
 * Deserialize a [SerializablePrivateKeyWallet] from a JSON parsed object.
 * @param value - The JSON parsed value that should be a [SerializablePrivateKeyWallet].
 */
export const deserializePrivateKeyWallet = (
  value: Partial<SerializablePrivateKeyWallet>,
): SerializablePrivateKeyWallet => {
  if (
    value.version === undefined ||
    value.type === undefined ||
    value.address === undefined ||
    value.privateKey === undefined ||
    value.addressPrefix === undefined
  ) {
    throw new Error('invalid serialized privateKey wallet');
  }

  if (value.type !== WalletType.PrivateKey) {
    throw new Error(`invalid privateKey wallet wallet type: ${value.type}`);
  }

  // Skip version check, at the moment we just have one version.
  return {
    version: value.version,
    type: value.type,
    address: value.address,
    privateKey: value.privateKey,
    addressPrefix: value.addressPrefix,
  };
};

/**
 * Deserialize a [SerializableWallet] from a JSON parsed object.
 * @param value - The JSON parsed value that should be a [SerializableWallet].
 */
export const deserializeWallet = (value: Partial<SerializableWallet>): SerializableWallet => {
  switch (value.type) {
    case WalletType.Web3Auth:
      return deserializeWeb3AuthWallet(value);
    case WalletType.PrivateKey:
      return deserializePrivateKeyWallet(value);
    default:
      // @ts-ignore
      throw new Error(`can't deserialize wallet with type ${value.type}`);
  }
};
