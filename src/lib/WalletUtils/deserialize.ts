import {
  SerializablePrivateKeyWallet,
  SerializableWallet,
  SerializableWalletConnectWallet,
  SerializableWeb3AuthWallet,
  WalletType,
} from 'types/wallet';

/**
 * Deserialize a [SerializableWeb3AuthWallet] from a JSON parsed object.
 * @param value - The JSON parsed value that should be a [SerializableWeb3AuthWallet].
 */
const deserializeWeb3AuthWallet = (
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
const deserializePrivateKeyWallet = (
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
 * Deserialize a [SerializableWalletConnectWallet] from a JSON parsed object.
 * @param value - The JSON parsed value that should be a [SerializableWalletConnectWallet].
 */
const deserializeWalletConnectWallet = (
  value: Partial<SerializableWalletConnectWallet>,
): SerializableWalletConnectWallet => {
  if (
    value.version === undefined ||
    value.type === undefined ||
    value.addressPrefix === undefined ||
    value.address === undefined ||
    value.walletApp === undefined ||
    value.sessionTopic === undefined
  ) {
    throw new Error('invalid serialized WalletConnect wallet');
  }

  // Check if the wallet has a temporary wallet.
  if (value.tempWallet !== undefined) {
    if (
      value.tempWallet.address === undefined ||
      value.tempWallet.privateKey === undefined ||
      value.tempWallet.authorizedMessages === undefined ||
      value.tempWallet.authorizationExpiration === undefined
    ) {
      throw new Error('invalid serialized WalletConnect wallet');
    }
  }

  return {
    type: value.type,
    version: value.version,
    addressPrefix: value.addressPrefix,
    address: value.address,
    walletApp: value.walletApp,
    sessionTopic: value.sessionTopic,
    tempWallet: value.tempWallet,
  };
};

/**
 * Deserialize a [SerializableWallet] from a JSON parsed object.
 * @param value - The JSON parsed value that should be a [SerializableWallet].
 */
// It's fine to disable the eslint rule here, since this is a utility function
// eslint-disable-next-line import/prefer-default-export
export const deserializeWallet = (value: Partial<SerializableWallet>): SerializableWallet => {
  switch (value.type) {
    case WalletType.Web3Auth:
      return deserializeWeb3AuthWallet(value);
    case WalletType.PrivateKey:
      return deserializePrivateKeyWallet(value);
    case WalletType.WalletConnect:
      return deserializeWalletConnectWallet(value);
    default:
      // @ts-ignore
      throw new Error(`can't deserialize wallet with type ${value.type}`);
  }
};
