import { Result, err, ok } from 'neverthrow';
import { useCallback } from 'react';
import { useActiveAccount } from '@recoil/accounts';
import { WalletType } from 'types/wallet';
import { getSdkError } from '@walletconnect/utils';
import useConnectWalletConnect from './useConnectWalletConnect';

/**
 * Hook that provides a function to close
 * the WalletConnect session that has been used to
 * import the user's Wallet.
 */
const useCloseWalletConnectSignerSession = () => {
  const activeAccount = useActiveAccount();
  const getWalletConnectClient = useConnectWalletConnect();

  return useCallback(async (): Promise<Result<void, Error>> => {
    if (!activeAccount || activeAccount.walletType !== WalletType.WalletConnect) {
      return ok(undefined);
    }
    const getClientResult = await getWalletConnectClient();
    if (getClientResult.isErr()) {
      return err(getClientResult.error);
    }

    const client = getClientResult.value;
    const isSessionActive = client.session
      .getAll()
      .find(s => s.topic === activeAccount.sessionTopic);
    if (activeAccount.tempWallet) {
      // TODO: Remove the authorizations.
    }

    if (isSessionActive) {
      client.disconnect({
        topic: activeAccount.sessionTopic,
        reason: getSdkError('USER_DISCONNECTED'),
      });
    }

    return ok(undefined);
  }, [activeAccount, getWalletConnectClient]);
};

export default useCloseWalletConnectSignerSession;
