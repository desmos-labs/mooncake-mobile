import { toHex } from '@cosmjs/encoding';
import {
  DesmosClient,
  getPubKeyBytes,
  getSignatureBytes,
  getSignedBytes,
} from '@desmoslabs/desmjs';
import useUpdateAuthToken from 'hooks/axios/useUpdateAuthToken';
import useRootNavigator from 'hooks/navigation/useRootNavigator';
import ROUTES from 'navigation/routes';
import { Result, ResultAsync, err } from 'neverthrow';
import React from 'react';
import GetNonce from 'services/axios/requests/GetNonce';
import Login, { LoginParams } from 'services/axios/requests/Login';
import { Wallet, WalletType } from 'types/wallet';

const usePromptSignLoginTransaction = () => {
  const navigation = useRootNavigator();

  return React.useCallback((): Promise<boolean> => {
    return new Promise(resolve => {
      navigation.navigate(ROUTES.CONFIRM_MODAL, {
        title: 'Sign login tx',
        subtitle: 'Sign the login transaction',
        removeModalAfterButtonPress: true,
        onPressPrimary: () => resolve(true),
        onDismiss: () => {
          navigation.goBack();
          resolve(false);
        },
      });
    });
  }, [navigation]);
};

/**
 * Generate the params to be used when performing the login on the APIs.
 * @param nonce string - Nonce that should be used to sign the login data.
 * @param wallet {@link AccountWithWallet} - Account with wallet that should be used to sign the login data.
 */
const generateLoginParams = (nonce: string, wallet: Wallet): ResultAsync<LoginParams, Error> => {
  return ResultAsync.fromPromise(
    DesmosClient.offline(wallet.signer),
    (error: any) => new Error(error.message),
  )
    .map(desmosClient => {
      // Pass an empty array as message, as we just need to sign something
      // to grab the SignatureResult
      return desmosClient.signTx(wallet.address, [], {
        fee: { amount: [], gas: '0' },
        memo: nonce,
        signerData: {
          sequence: 0,
          chainId: 'desmos',
          accountNumber: 0,
        },
      });
    })
    .map(result => {
      return {
        address: wallet.address,
        signatureBytes: toHex(getSignatureBytes(result)),
        pubkeyBytes: toHex(getPubKeyBytes(result)),
        signedBytes: toHex(getSignedBytes(result)),
      };
    });
};

/**
 * Hook that allows to perform the login for a given account.
 * After the login is successful, it returns the token that can be
 * used for future API requests.
 */
const usePerformLogin = () => {
  const updateAuthToken = useUpdateAuthToken();
  const promptSignLoginTransaction = usePromptSignLoginTransaction();

  return React.useCallback(
    async (account: Wallet): Promise<Result<string, Error>> => {
      let allowed = true;
      if (account.type === WalletType.WalletConnect) {
        allowed = await promptSignLoginTransaction();
      }

      if (allowed) {
        return GetNonce(account.address)
          .andThen(nonce => generateLoginParams(nonce, account))
          .andThen(params => Login(params))
          .map(result => {
            // Update the Axios auth token for future requests
            updateAuthToken(result);
            // Return the token for other usages
            return result;
          });
      } else {
        return err(new Error('User rejected the login transaction'));
      }
    },
    [promptSignLoginTransaction, updateAuthToken],
  );
};

export default usePerformLogin;
