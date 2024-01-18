import { fromHex } from '@cosmjs/encoding';
import { PrivateKeySigner, SigningMode } from '@desmoslabs/desmjs';
import { getWallet } from 'lib/SecureStorage';
import { err, ok, Result } from 'neverthrow';
import { useCallback } from 'react';
import {
  PrivateKeyWallet,
  SerializablePrivateKeyWallet,
  SerializableWeb3AuthWallet,
  Wallet,
  WalletType,
  Web3AuthWallet,
} from 'types/wallet';

/**
 * Function that initialize a PrivateKeySigner from the provided private key.
 * @param privateKey - Private key to use in the PrivateKeySigner.
 * @param signMode - Sign mode.
 * @param prefix - Bech32 address prefix.
 */
const initPrivateKeySigner = async (
  privateKey: Uint8Array,
  signMode: SigningMode,
  prefix: string,
): Promise<PrivateKeySigner> => {
  const signer = PrivateKeySigner.fromSecp256k1(privateKey, signMode, { prefix });
  await signer.connect();
  return signer;
};

/**
 * Hook that provides a function to initialize a Web3Auth wallet.
 */
const useInitWeb3AuthWallet = () => {
  const initWeb3AuthWallet = useCallback(
    async (
      serializedWallet: SerializableWeb3AuthWallet,
      signingMode?: SigningMode,
    ): Promise<Result<Web3AuthWallet, Error>> => {
      const privateKey = fromHex(serializedWallet.privateKey);

      return ok({
        type: WalletType.Web3Auth,
        address: serializedWallet.address,
        privateKey,
        addressPrefix: serializedWallet.addressPrefix,
        loginProvider: serializedWallet.loginProvider,
        signer: await initPrivateKeySigner(
          privateKey,
          signingMode ?? SigningMode.DIRECT,
          serializedWallet.addressPrefix,
        ),
      });
    },
    [],
  );

  return {
    initWeb3AuthWallet,
  };
};

/**
 * Hook that provides a function to initialize a Web3Auth wallet.
 */
const useInitPrivateKeyWallet = () => {
  const initPrivateKeyWallet = useCallback(
    async (
      serializedWallet: SerializablePrivateKeyWallet,
      signingMode?: SigningMode,
    ): Promise<Result<PrivateKeyWallet, Error>> => {
      const privateKey = fromHex(serializedWallet.privateKey);

      return ok({
        type: WalletType.PrivateKey,
        address: serializedWallet.address,
        privateKey,
        addressPrefix: serializedWallet.addressPrefix,
        signer: await initPrivateKeySigner(
          privateKey,
          signingMode ?? SigningMode.DIRECT,
          serializedWallet.addressPrefix,
        ),
      });
    },
    [],
  );

  return {
    initPrivateKeyWallet,
  };
};

/**
 * Hook that provides a function to unlock the wallet using the password.
 */
const useUnlockWalletWithPassword = () => {
  const { initWeb3AuthWallet } = useInitWeb3AuthWallet();
  const { initPrivateKeyWallet } = useInitPrivateKeyWallet();

  return useCallback(
    async (
      address: string,
      password: string,
      signingMode?: SigningMode,
    ): Promise<Result<Wallet, Error>> => {
      const serializedWallet = await getWallet(address, password);
      if (serializedWallet.isErr()) {
        return err(serializedWallet.error);
      }

      switch (serializedWallet.value.type) {
        case WalletType.Web3Auth:
          return initWeb3AuthWallet(serializedWallet.value, signingMode);
        case WalletType.PrivateKey:
          return initPrivateKeyWallet(serializedWallet.value, signingMode);
        default:
          // Safe to ignore, this branch should never occur in production
          // but just on development in case we add a new wallet type.
          // @ts-ignore
          return err(Error(`unsupported wallet type ${serializedWallet.type}`));
      }
    },
    [initWeb3AuthWallet, initPrivateKeyWallet],
  );
};

export default useUnlockWalletWithPassword;
