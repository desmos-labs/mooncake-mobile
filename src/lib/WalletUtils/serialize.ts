import { toHex } from '@cosmjs/encoding';
import {
  PrivateKeyWallet,
  SerializablePrivateKeyWallet,
  SerializableWallet,
  SerializableWalletConnectWallet,
  SerializableWeb3AuthWallet,
  Wallet,
  WalletConnectWallet,
  WalletSerializationVersion,
  WalletType,
  Web3AuthWallet,
} from 'types/wallet';

/**
 * Convert a [Web3AuthWallet] into a [SerializableWeb3AuthWallet]
 * @param wallet - The [Web3AuthWallet] to convert.
 */
const serializeWeb3AuthWallet = (wallet: Web3AuthWallet): SerializableWeb3AuthWallet => ({
  version: WalletSerializationVersion.Web3Auth,
  type: WalletType.Web3Auth,
  addressPrefix: wallet.addressPrefix,
  address: wallet.address,
  privateKey: toHex(wallet.privateKey),
  loginProvider: wallet.loginProvider,
});

/**
 * Convert a [Web3AuthWallet] into a [SerializableWeb3AuthWallet]
 * @param wallet - The [Web3AuthWallet] to convert.
 */
const serializePrivateKeyWallet = (wallet: PrivateKeyWallet): SerializablePrivateKeyWallet => ({
  version: WalletSerializationVersion.PrivateKey,
  type: WalletType.PrivateKey,
  addressPrefix: wallet.addressPrefix,
  address: wallet.address,
  privateKey: toHex(wallet.privateKey),
});

/**
 * Converts a [WalletConnectWallet] into a [SerializableWalletConnectWallet].
 * @param wallet - The [WalletConnectWallet] to convert.
 */
function serializeWalletConnectWallet(
  wallet: WalletConnectWallet,
): SerializableWalletConnectWallet {
  return {
    type: WalletType.WalletConnect,
    version: WalletSerializationVersion.WalletConnect,
    addressPrefix: wallet.addressPrefix,
    address: wallet.address,
    walletApp: wallet.walletApp,
    sessionTopic: wallet.sessionTopic,
    tempWallet: wallet.tempWallet,
  };
}

/**
 * Convert a [Wallet] into a [SerializableWallet]
 * @param wallet - The [Wallet] to convert.
 */
// It's fine to disable the eslint rule here, since this is a utility function
// eslint-disable-next-line import/prefer-default-export
export const serializeWallet = (wallet: Wallet): SerializableWallet => {
  let serializableWallet: SerializableWallet;

  switch (wallet.type) {
    case WalletType.Web3Auth:
      serializableWallet = serializeWeb3AuthWallet(wallet);
      break;
    case WalletType.PrivateKey:
      serializableWallet = serializePrivateKeyWallet(wallet);
      break;
    case WalletType.WalletConnect:
      serializableWallet = serializeWalletConnectWallet(wallet);
      break;
    default:
      // @ts-ignore
      throw new Error(`can't serialize wallet with type ${wallet.type}`);
  }

  return serializableWallet;
};
