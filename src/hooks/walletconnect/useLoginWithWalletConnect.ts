import { useCallback } from 'react';
import { WalletConnectWalletApp } from 'types/wallet';

/**
 * Hook that provides a function to start the
 * login through WalletConnect.
 */
const useLoginWithWalletConnect = () => {
  return useCallback(async (app: WalletConnectWalletApp) => {
    // TODO: Implement login flow.
    console.warn('TODO: Implement login flow, app: ', app);

    // Init WalletConnect client.
    // Send init session to the external app.
    // on error show message to the user.
    //
    // Prompt to the user that we need an authz grant
    // to have a smoother experience.
    // On reject stop the login flow.
    //
    // We have the approval by the user
    // generate a temporary wallet
    // and request the fee grant.
    //
    // On Tx error show message to the user
    // and allow the user to retry.
    //
    // On TX success we have the other account
    // session and an authorized temporary wallet.
  }, []);
};

export default useLoginWithWalletConnect;
