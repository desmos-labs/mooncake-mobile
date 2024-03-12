import SignClient from '@walletconnect/sign-client';
import { WalletConnectWalletApp } from 'types/wallet';
import { ok } from 'neverthrow';
import WalletConnectSigner from './signer';

// eslint-disable-next-line import/prefer-default-export
export const initDPMWalletConnectSigner = (client: SignClient) => {
  const signer = new WalletConnectSigner(WalletConnectWalletApp.DPM, client);

  return ok(signer);
};
