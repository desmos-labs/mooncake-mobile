import {OfflineDirectSigner} from '@cosmjs/proto-signing';
import GetNonce from 'services/axios/requests/GetNonce';
import Long from 'long';
import {fromBase64} from '@cosmjs/encoding';
import {SignDoc, TxBody} from 'cosmjs-types/cosmos/tx/v1beta1/tx';

// eslint-disable-next-line import/prefer-default-export
export const generateLoginData = async ({
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
