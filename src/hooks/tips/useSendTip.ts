import { useCallback } from 'react';
import { useActiveAccountAddress } from '@recoil/accounts';
import { MsgSendEncodeObject } from '@cosmjs/stargate';
import useSignAndBroadcastTx from 'hooks/tx/useSignAndBroadcastTx';
import { Bank, Coin } from '@desmoslabs/desmjs';
import { err, ok, Result } from 'neverthrow';
import { useTranslation } from 'react-i18next';
import useGetOnChainProfile from 'hooks/profiles/useGetOnChainProfile';
import { promiseToResult } from 'lib/NeverThrowUtils';
import { formatCoins } from 'lib/FormatUtils';
import { MsgSend } from '@desmoslabs/desmjs-types/cosmos/bank/v1beta1/tx';

/**
 * Hook that allows to send the tip to any of the supported targets.
 */
const useSendTip = () => {
  const { t } = useTranslation('tips');
  const activeAddress = useActiveAccountAddress();
  const getProfile = useGetOnChainProfile();
  const signAndBroadcastTx = useSignAndBroadcastTx();

  return useCallback(
    async (user: string, amount: Coin[]): Promise<Result<void, Error>> => {
      if (!activeAddress) {
        return err(new Error('Trying to send a tip without having an active account'));
      }

      const receiverProfileResult = await promiseToResult(
        getProfile(user),
        "Unknown error while fetching the user's profile",
      );
      if (receiverProfileResult.isErr()) {
        return err(receiverProfileResult.error);
      }
      const receiverProfile = receiverProfileResult.value;
      const userDtag = receiverProfile ? `@${receiverProfile.dTag}` : user;
      const formattedAmount = formatCoins(amount);

      // Build the message
      const msgSend: MsgSendEncodeObject = {
        typeUrl: Bank.v1beta1.MsgSendTypeUrl,
        value: MsgSend.fromPartial({
          amount,
          toAddress: user,
          fromAddress: activeAddress,
        }),
      };

      // Send the transaction
      await signAndBroadcastTx([msgSend], {
        onLoading: {
          popup: {
            description: t('sending tip'),
          },
        },
        onSuccess: {
          popup: {
            description: t('tip sent', { userDtag, amount: formattedAmount }),
          },
        },
        onError: {
          popup: {
            description: t('tip failed', { userDtag, amount: formattedAmount }),
          },
        },
      });

      return ok(undefined);
    },
    [activeAddress, getProfile, signAndBroadcastTx, t],
  );
};

// This is going to be used in the future, so we are going to disable the ts-prune rule for now
// ts-prune-ignore-next
export default useSendTip;
