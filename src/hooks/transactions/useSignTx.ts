import { StdFee } from '@cosmjs/amino';
import { EncodeObject } from '@cosmjs/proto-signing';
import { useCallback } from 'react';
import { Wallet, WalletType } from 'types/wallet';
import { DesmosClient, SignatureResult } from '@desmoslabs/desmjs';
import { SignerData } from '@cosmjs/stargate';
import { err, Result, ResultAsync } from 'neverthrow';

/**
 * Parameters required to perform an offline signature.
 */
export interface SignParams {
  /**
   * Messages that are included inside the transaction.
   */
  readonly messages: EncodeObject[];
  /**
   * Transaction fees.
   */
  readonly fees: StdFee;
  /**
   * Information about who is performing the signature.
   */
  readonly signerData: SignerData;
  /**
   * Transaction memo.
   */
  readonly memo?: string;
}

export interface SignResult {
  readonly signatureResult: SignatureResult;
}

/**
 * Hook that provides a function to sign a transaction.
 */
export default function useSignTx() {
  return useCallback(
    async (wallet: Wallet, signParams: SignParams): Promise<Result<SignResult, Error>> => {
      const clientResult = await ResultAsync.fromPromise(DesmosClient.offline(wallet.signer), () =>
        Error('Error initializing the DesmosClient'),
      );

      if (clientResult.isErr()) {
        return err(clientResult.error);
      }

      if (wallet.type === WalletType.Ledger) {
        // TODO: Show sign modal if from ledger
        console.log('Waiting for Ledger confirmation...');
      }

      // Perform the signature.
      const signResult = await ResultAsync.fromPromise(
        clientResult.value.signTx(wallet.address, signParams.messages, {
          fee: signParams.fees,
          memo: signParams.memo,
          signerData: signParams.signerData,
        }),
        e => Error(e?.toString() ?? 'Error while signing the transaction'),
      ).map(signatureResult => ({
        signatureResult,
      }));

      if (wallet.type === WalletType.Ledger) {
        // TODO: Hide sign modal
        console.log('Ledger signature received!');
      }

      return signResult;
    },
    [],
  );
}
