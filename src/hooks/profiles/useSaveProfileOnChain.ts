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
import { Wallet } from 'types/wallet';
import { useActiveAccountAddress } from '@recoil/accounts';
import { CanceledOperationError } from 'types/error';
import useUploadProfilePictures from 'hooks/profiles/useUploadProfilePictures';

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
  const [status, setStatus] = useState<SaveProfileStatus>(SaveProfileStatus.UNDEFINED);
  const broadcastTxOnChain = useBroadcastTxOnChain();
  const activeAccountAddress = useActiveAccountAddress()!;
  const uploadProfilePictures = useUploadProfilePictures();

  const saveProfile = React.useCallback(
    async (
      params: DesmosProfile,
      providedAccount: AccountWithWallet | undefined,
    ): Promise<Result<DeliverTxResponse, Error>> => {
      let wallet: Wallet | undefined;

      if (providedAccount !== undefined) {
        wallet = providedAccount.wallet;
      }

      // Upload the profile and cover pictures
      setStatus(SaveProfileStatus.UPLOADING_PICTURES);
      const uploadPictureResult = await uploadProfilePictures(params);

      if (uploadPictureResult.isErr()) {
        setStatus(SaveProfileStatus.UNDEFINED);
        return err(uploadPictureResult.error);
      }

      const { profilePictureUrl, coverPictureUrl } = uploadPictureResult.value;

      // Build the message to save the profile on-chain
      const { dTag, nickname, bio } = params;
      const msgSaveProfile: MsgSaveProfileEncodeObject = {
        typeUrl: MsgSaveProfileTypeUrl,
        value: {
          creator: wallet?.address ?? activeAccountAddress,
          dtag: replaceUndefined(dTag),
          nickname: replaceUndefined(nickname),
          bio: replaceUndefined(bio),
          profilePicture: replaceUndefined(profilePictureUrl),
          coverPicture: replaceUndefined(coverPictureUrl),
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
        setStatus(SaveProfileStatus.UNDEFINED);
        return err(result.error);
      }

      // Return the result
      setStatus(SaveProfileStatus.DONE);
      return result;
    },
    [activeAccountAddress, broadcastTxOnChain, uploadProfilePictures],
  );

  return {
    status,
    saveProfile,
  };
};

export default useSaveProfileOnChain;
