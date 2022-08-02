import {StdFee} from '@cosmjs/amino';
import {EncodeObject, OfflineSigner} from '@cosmjs/proto-signing';
import {isBroadcastTxFailure} from '@cosmjs/stargate';
import {DesmosClient} from '@desmoslabs/desmjs';
import {Coin} from 'cosmjs-types/cosmos/base/v1beta1/coin';
import {SignMode} from 'cosmjs-types/cosmos/tx/signing/v1beta1/signing';
import {AuthInfo, SignerInfo, TxRaw} from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import {Any} from 'cosmjs-types/google/protobuf/any';
import Long from 'long';
import {useCallback} from 'react';
import OfflineSignerAdapter from '@desmoslabs/desmjs/build/signers/adapter';
import EnvConfig from 'config/EnvConfig';

function makeSignerInfo(
  signer: {readonly pubkey: Any; readonly sequence: number},
  signMode: SignMode,
): SignerInfo {
  return SignerInfo.fromPartial({
    publicKey: signer.pubkey,
    modeInfo: {
      single: {
        mode: signMode,
      },
    },
    sequence: Long.fromNumber(signer.sequence),
  });
}

export function makeAuthInfoBytes(
  signer: {readonly pubkey: Any; readonly sequence: number},
  feeAmount: readonly Coin[],
  gasLimit: number,
  signMode: SignMode,
  granter?: string,
): Uint8Array {
  return AuthInfo.encode(
    AuthInfo.fromPartial({
      signerInfos: [makeSignerInfo(signer, signMode)],
      fee: {
        amount: [...feeAmount],
        gasLimit: Long.fromNumber(gasLimit),
        granter,
      },
    }),
  ).finish();
}

/**
 * Hook that returns a function that create a transaction with the provided
 * messages and sign that with the provided signer.
 * If the transactions fails will be raised an Error.
 */
export default function useBroadcastMessages() {
  return useCallback(
    async (
      signer: OfflineSigner,
      messages: EncodeObject[],
      fee: StdFee,
      memo?: string,
      granter?: string,
    ) => {
      const _signer = new OfflineSignerAdapter(signer);

      const client = await DesmosClient.connectWithSigner(
        EnvConfig.DESMOS_RPC,
        _signer,
      );

      const signerAddress = await _signer.getAccounts();

      const signed = await client.signTx(
        signerAddress[0].address,
        messages,
        fee,
        memo ?? '',
        undefined,
        granter,
      );

      const broadcastResult = await client.broadcastTx(
        TxRaw.encode(signed.txRaw).finish(),
      );

      if (isBroadcastTxFailure(broadcastResult)) {
        throw new Error(broadcastResult.rawLog ?? 'Unknown error');
      }
    },
    [],
  );
}
