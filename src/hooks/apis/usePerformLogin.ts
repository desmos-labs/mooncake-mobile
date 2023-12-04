import { toHex } from '@cosmjs/encoding';
import {
  DesmosClient,
  getPubKeyBytes,
  getSignatureBytes,
  getSignedBytes,
} from '@desmoslabs/desmjs';
import useUpdateAuthToken from 'hooks/axios/useUpdateAuthToken';
import { ResultAsync } from 'neverthrow';
import React from 'react';
import GetNonce from 'services/axios/requests/GetNonce';
import Login, { LoginParams } from 'services/axios/requests/Login';
import { Wallet } from 'types/wallet';

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
  return React.useCallback(
    (account: Wallet): ResultAsync<string, Error> => {
      return GetNonce(account.address)
        .andThen(nonce => generateLoginParams(nonce, account))
        .andThen(params => Login(params))
        .map(result => {
          // Update the Axios auth token for future requests
          updateAuthToken(result);
          // Return the token for other usages
          return result;
        });
    },
    [updateAuthToken],
  );
};

export default usePerformLogin;
