import SignClient from '@walletconnect/sign-client';
import { WalletConnectWalletApp } from 'types/wallet';
import { Signer } from '@desmoslabs/desmjs';
import { Result } from 'neverthrow';
import { initDPMWalletConnectSession } from './dpm';

// eslint-disable-next-line import/prefer-default-export
export const initWalletConnectSession = async (
  client: SignClient,
  app: WalletConnectWalletApp,
): Promise<Result<Signer, Error>> => {
  switch (app) {
    case WalletConnectWalletApp.DPM:
      return initDPMWalletConnectSession(client);
    default:
      throw new Error(`unsupported WalletConnect app ${app}`);
  }
};

