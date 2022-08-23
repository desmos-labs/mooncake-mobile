import React from 'react';
import {MMKVKEYS, useMMKVStorage} from 'lib/MMKVStorage';
import useUnlockWallet from 'hooks/useUnlockWallet';
import {getAccounts} from 'lib/SecureStorage';
import Long from 'long';
import {fromBase64} from '@cosmjs/encoding';
import {SignDoc, TxBody} from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import GetNonce from 'services/axios/requests/GetNonce';
import {OfflineDirectSigner} from '@cosmjs/proto-signing';
import Login from 'services/axios/requests/Login/index';
import {updateAuthToken} from 'services/axios';

const generateLoginData = async ({
  wallet,
  address,
}: {
  wallet: OfflineDirectSigner;
  address: string;
}): Promise<{
  signatureBytes: Uint8Array;
  pubkeyBytes: Uint8Array;
  signedBytes: Uint8Array;
}> => {
  const {nonce} = await GetNonce({address});

  const signDoc = SignDoc.fromPartial({
    accountNumber: Long.ZERO,
    authInfoBytes: new Uint8Array(),
    bodyBytes: TxBody.encode(
      TxBody.fromPartial({
        memo: nonce,
      }),
    ).finish(),
    chainId: '',
  });
  const result = await (wallet as OfflineDirectSigner).signDirect(
    address,
    signDoc,
  );

  return {
    signatureBytes: fromBase64(result.signature.signature),
    pubkeyBytes: fromBase64(result.signature.pub_key.value),
    signedBytes: SignDoc.encode(signDoc).finish(),
  };
};

const useLogin = () => {
  const [curAddress] = useMMKVStorage<string>(MMKVKEYS.ACTIVE_ACCOUNT_ADDR);

  const unlockWallet = useUnlockWallet();

  React.useEffect(() => {
    if (!curAddress) return;

    login(curAddress).then();
  }, [curAddress]);

  const login = React.useCallback(async (activeAddress: string) => {
    const accounts = await getAccounts();

    const activeAccount = accounts?.find(x => x.address === activeAddress);

    if (!activeAccount) {
      throw new Error(`[LOGIN] No account found for address ${activeAddress}`);
    }

    const unlockResult = await unlockWallet(activeAccount!);

    if (!unlockResult || !unlockResult.wallet) {
      throw new Error('[LOGIN] Unable to resolve wallet from unlock request');
    }

    const {wallet} = unlockResult;

    const {signatureBytes, pubkeyBytes, signedBytes} = await generateLoginData({
      wallet: wallet as OfflineDirectSigner,
      address: activeAddress,
    });

    const {token} = await Login({
      address: activeAddress,
      signatureBytes,
      pubkeyBytes,
      signedBytes,
    });

    if (!token) {
      throw new Error('[LOGIN] No token received from Login request');
    }

    updateAuthToken(token);
  }, []);

  return {
    login,
  };
};

export default useLogin;
