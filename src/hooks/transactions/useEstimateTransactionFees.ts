import { useGetCurrentChainGasPrice, useGetCurrentChainInfo } from '@recoil/settings';
import { useStoredAccounts } from '@recoil/accounts';
import React from 'react';
import { EncodeObject } from '@cosmjs/proto-signing';
import { err, ResultAsync } from 'neverthrow';
import { DesmosClient } from '@desmoslabs/desmjs';

/**
 * Hook that provides a function to estimate the fees of a transaction.
 */
export const useEstimateTransactionFees = () => {
  const getCurrentChainInfo = useGetCurrentChainInfo();
  const getGasPrice = useGetCurrentChainGasPrice();
  const accounts = useStoredAccounts();

  return React.useCallback(
    async (accountAddress: string, messages: EncodeObject[], memo?: string) => {
      // Make sure the account exists
      const account = accounts[accountAddress];
      if (account === undefined) {
        return err(Error(`Can't find account with address ${accountAddress}`));
      }

      // Get the chain data
      const { rpcUrl } = getCurrentChainInfo();
      const gasPrice = getGasPrice();

      // Build the client
      const clientResult = await ResultAsync.fromPromise(
        DesmosClient.connect(rpcUrl, { gasPrice }),
        () => Error("Can't prepare client to estimate fees"),
      );
      if (clientResult.isErr()) {
        return err(clientResult.error);
      }

      // Estimate the transaction fees
      return ResultAsync.fromPromise(
        clientResult.value.estimateTxFee(accountAddress, messages, {
          memo,
          publicKey: {
            algo: account.algo,
            bytes: account.pubKey,
          },
        }),
        e => Error((<Partial<Error>>e)?.message ?? "Can't estimate fees"),
      );
    },
    [accounts, getCurrentChainInfo, getGasPrice],
  );
};

export default useEstimateTransactionFees;
