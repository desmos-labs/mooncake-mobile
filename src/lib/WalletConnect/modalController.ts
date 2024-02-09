import { Linking } from 'react-native';
import { WalletConnectWalletApp } from 'types/wallet';

// eslint-disable-next-line import/prefer-default-export
export class WalletConnectModalController {
  private readonly app: WalletConnectWalletApp;

  constructor(app: WalletConnectWalletApp) {
    this.app = app;
  }

  public open(uri: string, _onClose: () => void): void {
    const encodedUri = encodeURIComponent(uri);
    console.log(`[WalletConnectModalController] open: ${uri}`);
    switch (this.app) {
      case WalletConnectWalletApp.DPM:
        Linking.openURL(`dpm://wcV2?uri=${encodedUri}&returnToApp=true`);
        break;
      case WalletConnectWalletApp.Keplr:
        Linking.openURL(`keplrwallet://wcV2?${uri}`);
        break;
      case WalletConnectWalletApp.Leap:
        Linking.openURL(`leapcosmos://wcV2?${encodedUri}`);
        break;
      default:
        throw new Error(`unsupported WalletConnect app ${this.app}`);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  public close(): void {
    // We need this just to implement the WalletConnect modal controller
    // interface.
  }
}
