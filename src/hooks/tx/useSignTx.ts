import { StdFee } from '@cosmjs/amino';
import { EncodeObject } from '@cosmjs/proto-signing';
import React, { useCallback } from 'react';
import { Wallet } from 'types/wallet';
import { DesmosClient, SignatureResult, SignTxOptions } from '@desmoslabs/desmjs';
import { SignerData } from '@cosmjs/stargate';
import { err, Result, ResultAsync } from 'neverthrow';
import { getFeeGrantAllowanceForMessages, getOnChainGrants } from 'lib/grantsUtils';
import { buildDesmosClient, queryUserBalance, userCanUseOurFeeGranter } from 'lib/TxUtils';
import { useApolloClient } from '@apollo/client';
import { useCurrentChainGasPrice, useCurrentChainInfo } from '@recoil/settings';

/**
 * Type of signature result.
 */
export enum SignMode {
  /**
   * Signature made offline without querying the chain for the
   * account sequence number.
   */
  Offline,
  /**
   * Signature made querying the user sequence number from the chain.
   */
  Online,
}

/**
 * Parameters required to perform an offline signature.
 */
export interface OfflineSignParams {
  readonly mode: SignMode.Offline;
  readonly messages: EncodeObject[];
  readonly fees: StdFee;
  readonly signerData: SignerData;
  readonly memo?: string;
}

/**
 * Parameters required to perform an offline signature.
 */
export interface OnlineSignParams {
  readonly mode: SignMode.Online;
  readonly messages: EncodeObject[];
  readonly fees: StdFee;
  readonly feeGranter?: string;
  readonly memo?: string;
}

export type SignParams = OfflineSignParams | OnlineSignParams;

const useGetClientFromSignMode = () => {
  const chainInfo = useCurrentChainInfo();
  const gasPrice = useCurrentChainGasPrice();

  return useCallback(
    async (signMode: SignMode, { signer }: Wallet) => {
      switch (signMode) {
        case SignMode.Offline:
          return ResultAsync.fromPromise(DesmosClient.offline(signer), e =>
            Error(`error while initializing the client: ${e}`),
          );
        case SignMode.Online:
          return buildDesmosClient(chainInfo!.rpcUrl, signer, gasPrice);
        default:
          return err(Error(`can't build client for sign mode ${signMode}`));
      }
    },
    [chainInfo, gasPrice],
  );
};

/**
 * Hook that provides a function to sign a transaction.
 */
export default function useSignTx() {
  const chainInfo = useCurrentChainInfo()!;
  const apolloClient = useApolloClient();
  const getClientFromSignMode = useGetClientFromSignMode();

  return React.useCallback(
    async (wallet: Wallet, signParams: SignParams): Promise<Result<SignatureResult, Error>> => {
      let feeGranter: string | undefined;
      if (signParams.mode === SignMode.Online) {
        // We are signing a transaction in online mode, lets extract the fee granter.
        feeGranter = signParams.feeGranter;
        // The fee granter is undefined, lets get it from chain.
        if (feeGranter === undefined) {
          // Get the user balance first, since the user should have any coins
          // to use our fee granter.
          const userBalanceResult = await queryUserBalance(apolloClient, wallet.address);
          if (userBalanceResult.isErr()) {
            return err(userBalanceResult.error);
          }

          const canUseOurFeeGranter = userCanUseOurFeeGranter(
            userBalanceResult.value,
            chainInfo.stakeCurrency.coinMinimalDenom,
          );
          if (canUseOurFeeGranter) {
            const getFeeGrantsResult = await getOnChainGrants(apolloClient, wallet.address);
            if (getFeeGrantsResult.isOk()) {
              // Find the granter that can pay for all the messages that we
              // want to broadcast.
              feeGranter = getFeeGrantAllowanceForMessages(
                getFeeGrantsResult.value,
                signParams.messages.map(m => m.typeUrl),
              )?.granterAddress;
            }
          }
        }
      }

      const getClientResult = await getClientFromSignMode(signParams.mode, wallet);
      if (getClientResult.isErr()) {
        return err(getClientResult.error);
      }

      let signTxOptions: SignTxOptions;
      switch (signParams.mode) {
        case SignMode.Online:
          signTxOptions = {
            memo: signParams.memo,
            fee: signParams.fees,
            feeGranter,
          };
          break;
        case SignMode.Offline:
          signTxOptions = {
            memo: signParams.memo,
            fee: signParams.fees,
            signerData: signParams.signerData,
          };
          break;
        default:
          // @ts-ignore
          return err(Error(`unknown signMode ${signParams.mode}`));
      }

      const client = getClientResult.value;
      const signResult = await ResultAsync.fromPromise(
        client.signTx(wallet.address, signParams.messages, signTxOptions),
        (e: any) => Error(e?.message ?? 'an unknown error occurred during the signature'),
      );
      client.disconnect();

      return signResult;
    },
    [apolloClient, chainInfo.stakeCurrency.coinMinimalDenom, getClientFromSignMode],
  );
}
