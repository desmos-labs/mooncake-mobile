import { useCallback } from 'react';
import { useActiveAccountAddress } from '@recoil/accounts';
import { useAppStateValue } from '@recoil/appState';
import { MsgSendEncodeObject } from '@cosmjs/stargate';
import { useSignAndBroadcastTx } from 'hooks/tx/useSignAndBroadcastTx';
import { Coin } from '@desmoslabs/desmjs';
import { err, ok, Result } from 'neverthrow';

/**
 * Hook that allows to send the tip to any of the supported targets.
 */
const useSendTip = () => {
  const activeAddress = useActiveAccountAddress();

  const subspaceParams = useAppStateValue('subspaceParams');
  const tipsContractAddress = subspaceParams.tipsContractConfig?.address ?? '';
  const tipPercentage = subspaceParams.tipsContractConfig?.serviceFeePercentage ?? 0;

  const signAndBroadcastTx = useSignAndBroadcastTx();

  return useCallback(
    async (user: string, amount: Coin[]): Promise<Result<void, Error>> => {
      if (!activeAddress) {
        return err(new Error('Trying to send a tip without having an active account'));
      }

      // Build the message
      const msgSend: MsgSendEncodeObject = {
        typeUrl: '/cosmos.bank.v1beta1.MsgSend',
        value: {
          amount,
          toAddress: user,
          fromAddress: activeAddress,
        },
      };

      // Send the transaction
      await signAndBroadcastTx([msgSend]);

      return ok(undefined);
    },
    [activeAddress, tipPercentage, tipsContractAddress],
  );
};

export default useSendTip;
