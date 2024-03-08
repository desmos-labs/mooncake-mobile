import SignClient from '@walletconnect/sign-client';
import { SessionTypes } from '@walletconnect/types';
import { WalletConnectWalletApp } from 'types/wallet';
import { promiseToResult } from 'lib/NeverThrowUtils';
import { err, ok } from 'neverthrow';
import WalletConnectSigner from './signer';

// eslint-disable-next-line import/prefer-default-export
export const initDPMWalletConnectSession = async (
  client: SignClient,
  previousSession?: SessionTypes.Struct,
) => {
  const signer = new WalletConnectSigner(WalletConnectWalletApp.DPM, client);

  const connectResult = await promiseToResult(
    previousSession ? signer.connectToSession(previousSession) : signer.connect(),
    'Unkwonwn error while connecting to the Desmos chain',
  );

  if (connectResult.isErr()) {
    return err(connectResult.error);
  }

  return ok(signer);
};
