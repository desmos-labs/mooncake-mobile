import React from 'react';
import GetNonce from 'services/axios/requests/GetNonce';
import { StdFee } from '@cosmjs/amino';
import {
  DesmosClient,
  getPubKeyBytes,
  getSignatureBytes,
  getSignedBytes,
} from '@desmoslabs/desmjs';
import { toHex } from '@cosmjs/encoding';
import { AccountWithWallet } from 'types/account';
import { SignerData } from '@cosmjs/stargate';
import Login, { LoginParams } from 'services/axios/requests/Login';
import { useUpdateAuthToken } from 'services/axios';

/**
 * Generate the params to be used when performing the login on the APIs.
 * @param account {@link AccountWithWallet} - Account with wallet that should be used to sign the login data.
 */
const generateLoginParams = async (account: AccountWithWallet): Promise<LoginParams> => {
  const { nonce } = await GetNonce(account.account.address);
  const fee: StdFee = { amount: [], gas: '0' };

  const { address } = account.wallet;
  const signerData: SignerData = {
    sequence: 0,
    chainId: 'desmos',
    accountNumber: 0,
  };
  const desmosClient = await DesmosClient.offline(account.wallet.signer);

  // Pass an empty array as message, as we just need to sign something
  // to grab the SignatureResult
  const result = await desmosClient.signTx(address, [], fee, nonce, signerData);

  return {
    address: account.wallet.address,
    signatureBytes: toHex(getSignatureBytes(result)),
    pubkeyBytes: toHex(getPubKeyBytes(result)),
    signedBytes: toHex(getSignedBytes(result)),
  };
};

/**
 * Hook that allows to perform the login for a given account.
 * After the login is successful, it returns the token that can be
 * used for future API requests.
 */
const usePerformLogin = () => {
  const updateAuthToken = useUpdateAuthToken();
  return React.useCallback(
    async (account: AccountWithWallet) => {
      // Perform the login
      const params = await generateLoginParams(account);
      const { token } = await Login(params);

      // Update the Axios auth token for future requests
      updateAuthToken(token);

      // Return the token for other usages
      return token;
    },
    [updateAuthToken],
  );
};

export default usePerformLogin;
