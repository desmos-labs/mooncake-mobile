import * as React from 'react';
import { useCurrentChainGasPrice, useCurrentChainInfo } from '@recoil/settings';
import { buildDesmosClient } from 'lib/TxUtils';
import { err, ok, Result } from 'neverthrow';
import { DesmosClient } from '@desmoslabs/desmjs';
import useUnlockWallet from 'hooks/useUnlockWallet';
import { Wallet } from 'types/wallet';

interface DesmosClientResult {
  readonly desmosClient: DesmosClient;
  readonly wallet: Wallet;
}

/**
 * Hook that returns a function to prepare a Desmos client in order to perform a transaction.
 */
const usePrepareDesmosClientAndWallet = () => {
  const chainInfo = useCurrentChainInfo();
  const chainGasPrice = useCurrentChainGasPrice();
  const unlockWallet = useUnlockWallet();

  return React.useCallback(
    async (walletOvveride?: Wallet): Promise<Result<DesmosClientResult, Error>> => {
      if (!chainInfo || !chainGasPrice) {
        return err(Error('Missing chain info or gas price'));
      }

      // Get the user's wallet by unlocking it or using the in-memory one
      let wallet: Wallet;
      if (walletOvveride === undefined) {
        const walletUnlockResult = await unlockWallet();
        if (walletUnlockResult.isErr()) {
          return err(walletUnlockResult.error);
        }
        const { wallet: unlockedWallet } = walletUnlockResult.value;
        wallet = unlockedWallet;
      } else {
        wallet = walletOvveride;
      }

      // Prepare the desmos client
      const result = await buildDesmosClient(chainInfo.rpcUrl, wallet.signer, chainGasPrice);
      if (result.isErr()) {
        return err(result.error);
      }

      return ok({
        wallet,
        desmosClient: result.value,
      });
    },
    [chainGasPrice, chainInfo, unlockWallet],
  );
};

export default usePrepareDesmosClientAndWallet;
