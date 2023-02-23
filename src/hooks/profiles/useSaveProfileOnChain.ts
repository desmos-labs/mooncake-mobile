import React, { useState } from 'react';
import { AccountWithWallet } from 'types/account';
import useBroadcastTxOnChain from 'hooks/transactions/useBroadcastTxOnChain';
import {
  DeliverTxResponse,
  DoNotModify,
  MsgSaveProfileEncodeObject,
  MsgSaveProfileTypeUrl,
} from '@desmoslabs/desmjs';
import { err, ok, Result } from 'neverthrow';
import { DesmosProfile } from 'types/desmos';
import { isPictureAsset } from 'lib/ProfileUtils';
import { Wallet } from 'types/wallet';
import { useActiveAccountAddress } from '@recoil/accounts';
import { CanceledOperationError } from 'types/error';
import useUploadAsset from 'hooks/useUploadAsset';

/**
 * Replaces the given possibly undefined value with <code>[do-not-modify]</code>.
 * @param value {string | undefined} Value to be replaced, if undefined.
 */
const replaceUndefined = (value: string | undefined): string => {
  return value ?? DoNotModify;
};

export enum SaveProfileStatus {
  UNDEFINED,
  UPLOADING_PICTURES,
  BROADCASTING_TX,
  DONE,
}

/**
 * Hook that allows to save a Desmos profile on-chain.
 * The profile will be saved using the given parameters and account.
 * If no account is provided, the current user account will be used instead.
 */
const useSaveProfileOnChain = () => {
  const activeAccountAddress = useActiveAccountAddress();
  if (!activeAccountAddress) {
    throw new Error('Cannot save profile on-chain without an active account');
  }

  const uploadAsset = useUploadAsset();
  const broadcastTxOnChain = useBroadcastTxOnChain();

  const [status, setStatus] = useState<SaveProfileStatus>(SaveProfileStatus.UNDEFINED);

  const saveProfile = React.useCallback(
    async (
      params: DesmosProfile,
      providedAccount: AccountWithWallet | undefined,
    ): Promise<Result<DeliverTxResponse, Error>> => {
      let wallet: Wallet | undefined;

      if (providedAccount !== undefined) {
        wallet = providedAccount.wallet;
      }

      // Upload the profile and cover picture
      setStatus(SaveProfileStatus.UPLOADING_PICTURES);
      const { coverPicture, profilePicture } = params;

      const profilePicResult = isPictureAsset(profilePicture)
        ? await uploadAsset(profilePicture)
        : undefined;
      if (profilePicResult?.isErr()) {
        return err(profilePicResult.error);
      }

      const coverPicResult = isPictureAsset(coverPicture)
        ? await uploadAsset(coverPicture)
        : undefined;
      if (coverPicResult?.isErr()) {
        return err(coverPicResult.error);
      }

      const profilePicUrl = profilePicResult?.unwrapOr(undefined)?.uri;
      const coverPicUrl = coverPicResult?.unwrapOr(undefined)?.uri;

      // Build the message to save the profile on-chain
      const { dTag, nickname, bio } = params;
      const msgSaveProfile: MsgSaveProfileEncodeObject = {
        typeUrl: MsgSaveProfileTypeUrl,
        value: {
          creator: wallet?.address ?? activeAccountAddress,
          dtag: replaceUndefined(dTag),
          nickname: replaceUndefined(nickname),
          bio: replaceUndefined(bio),
          profilePicture: replaceUndefined(profilePicUrl),
          coverPicture: replaceUndefined(coverPicUrl),
        },
      };

      // Sign and broadcast the transaction
      setStatus(SaveProfileStatus.BROADCASTING_TX);
      const result = await new Promise<Result<DeliverTxResponse, Error>>(resolve => {
        broadcastTxOnChain([msgSaveProfile], {
          accountAddressOrWallet: wallet,
          onSuccess: txResponse => {
            resolve(ok(txResponse));
          },
          onCancel: () => {
            resolve(err(new CanceledOperationError()));
          },
        });
      });

      if (result.isErr()) {
        return err(result.error);
      }

      // Return the result
      setStatus(SaveProfileStatus.DONE);
      return result;
    },
    [activeAccountAddress, broadcastTxOnChain],
  );

  return {
    status,
    saveProfile,
  };
};

export default useSaveProfileOnChain;
