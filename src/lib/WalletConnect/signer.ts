import {
  SignClient,
  WalletConnectSigner as DesmJSWalletConnectSigner,
  LocalStorageI,
} from '@desmoslabs/desmjs-walletconnect-v2';
import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { DirectSignResponse } from '@cosmjs/proto-signing';
import { AminoSignResponse, StdSignDoc } from '@cosmjs/amino';
import { WalletConnectWalletApp } from 'types/wallet';
import { Linking } from 'react-native';
import { SigningMode } from '@desmoslabs/desmjs';
import { MMKV } from 'react-native-mmkv';
import { WalletConnectModalController } from './modalController';

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

/**
 * Extension of the {@link DesmJSWalletConnectSigner} that will
 * open the external wallet application when the user is signing a
 * transaction.
 */
export default class WalletConnectSigner extends DesmJSWalletConnectSigner {
  private readonly app: WalletConnectWalletApp;

  constructor(app: WalletConnectWalletApp, client: SignClient) {
    super(client, {
      chain: 'desmos:desmos-mainnet',
      // Here we use AMINO to support Ledger imported accounts.
      signingMode: SigningMode.AMINO,
      qrCodeModalController: new WalletConnectModalController(app),
      sessionsCacheStorage: WalletConnectSessionStorage,
    });
    this.app = app;
  }

  /**
   * Function to trigger the opening of the external application.
   */
  private async openExternalApp() {
    switch (this.app) {
      case WalletConnectWalletApp.DPM:
        await Linking.openURL('dpm://open');
        break;
      case WalletConnectWalletApp.Leap:
        await Linking.openURL('leapcosmos://open');
        break;
      case WalletConnectWalletApp.Keplr:
        await Linking.openURL('keplrwallet://open');
        break;
    }
  }

  async signDirect(signerAddress: string, signDoc: SignDoc): Promise<DirectSignResponse> {
    const signPromise = super.signDirect(signerAddress, signDoc);
    await this.openExternalApp();
    return signPromise;
  }

  async signAmino(signerAddress: string, signDoc: StdSignDoc): Promise<AminoSignResponse> {
    const signPromise = super.signAmino(signerAddress, signDoc);
    await this.openExternalApp();
    return signPromise;
  }
}
