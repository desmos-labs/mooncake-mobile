import SignClient from '@walletconnect/sign-client';
import { SessionTypes } from '@walletconnect/types';
import { WalletConnectWalletApp } from 'types/wallet';
import { Result } from 'neverthrow';
import { WalletConnectSigner } from '@desmoslabs/desmjs-walletconnect-v2';
import { initDPMWalletConnectSession } from './dpm';

// eslint-disable-next-line import/prefer-default-export
export const initWalletConnectSession = async (
  client: SignClient,
  app: WalletConnectWalletApp,
  previousSession?: SessionTypes.Struct,
): Promise<Result<WalletConnectSigner, Error>> => {
  switch (app) {
    case WalletConnectWalletApp.DPM:
      return initDPMWalletConnectSession(client, previousSession);
    default:
      throw new Error(`unsupported WalletConnect app ${app}`);
  }
};
