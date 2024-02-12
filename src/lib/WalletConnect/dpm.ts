import { LocalStorageI } from '@desmoslabs/desmjs-walletconnect-v2';
import SignClient from '@walletconnect/sign-client';
import { SessionTypes } from '@walletconnect/types';
import { SigningMode } from '@desmoslabs/desmjs';
import { MMKV } from 'react-native-mmkv';
import { WalletConnectWalletApp } from 'types/wallet';
import { promiseToResult } from 'lib/NeverThrowUtils';
import { err, ok } from 'neverthrow';
import { WalletConnectModalController } from './modalController';
import WalletConnectSigner from './signer';

const MMKVLocalStorage = new MMKV({
  id: 'mmkw-localstorage',
});

const WalletConnectSessionStorage: LocalStorageI = {
  getItem: (key: string) => {
    return MMKVLocalStorage.getString(key) ?? null;
  },
  setItem: (key: string, value: string) => {
    return MMKVLocalStorage.set(key, value);
  },
  removeItem: (key: string) => {
    return MMKVLocalStorage.delete(key);
  },
};

// eslint-disable-next-line import/prefer-default-export
export const initDPMWalletConnectSession = async (
  client: SignClient,
  previousSession?: SessionTypes.Struct,
) => {
  const signer = new WalletConnectSigner(WalletConnectWalletApp.DPM, client, {
    chain: 'desmos:desmos-mainnet',
    // Here we use AMINO to support Ledger imported accounts.
    signingMode: SigningMode.AMINO,
    qrCodeModalController: new WalletConnectModalController(WalletConnectWalletApp.DPM),
    sessionsCacheStorage: WalletConnectSessionStorage,
  });

  const connectResult = await promiseToResult(
    previousSession ? signer.connectToSession(previousSession) : signer.connect(),
    'Unkwonwn error while connecting to the Desmos chain',
  );

  if (connectResult.isErr()) {
    return err(connectResult.error);
  }

  return ok(signer);
};
