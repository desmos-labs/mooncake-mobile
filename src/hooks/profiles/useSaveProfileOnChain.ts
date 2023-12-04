import React, { useState } from 'react';
import { AccountWithWallet } from 'types/account';
import { DoNotModify, Profiles } from '@desmoslabs/desmjs';
import { err, ok } from 'neverthrow';
import { DesmosProfile } from 'types/desmos';
import { useActiveAccountAddress } from '@recoil/accounts';
import useUploadProfilePictures from 'hooks/profiles/useUploadProfilePictures';
import useNavigateToSignAndBroadcastTx from 'hooks/broadcast/useNavigateToSignAndBroadcastTx';
import { Alert } from 'react-native';

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
  const activeAccountAddress = useActiveAccountAddress()!;
  const navigateToSignAndBroadcastTx = useNavigateToSignAndBroadcastTx();
  const { uploadPictures } = useUploadProfilePictures();

  const saveProfile = React.useCallback(
    async (
      params: DesmosProfile,
      providedAccount: AccountWithWallet | undefined,
      onProfileSaved: () => void,
      feeGranter?: string,
      customHeader?: string,
      customBody?: string,
    ) => {
      const addressToUse = providedAccount ? providedAccount.account.address : activeAccountAddress;
      if (addressToUse === undefined) {
        return err(new Error('Cannot save a profile without an active account or address'));
      }

      // Upload the profile and cover pictures
      setStatus(SaveProfileStatus.UPLOADING_PICTURES);
      const uploadPictureResult = await uploadPictures(params.profilePicture, params.coverPicture);

      if (!uploadPictureResult) {
        setStatus(SaveProfileStatus.UNDEFINED);
        Alert.alert('Error', 'An error occurred while uploading the pictures');
        return;
      }
      const { profilePictureUrl, coverPictureUrl } = uploadPictureResult;
      // Build the message to save the profile on-chain
      const { dTag, nickname, bio } = params;
      const msgSaveProfile: Profiles.v3.MsgSaveProfileEncodeObject = {
        typeUrl: Profiles.v3.MsgSaveProfileTypeUrl,
        value: {
          creator: addressToUse,
          dtag: replaceUndefined(dTag),
          nickname: replaceUndefined(nickname),
          bio: replaceUndefined(bio),
          profilePicture: replaceUndefined(profilePictureUrl),
          coverPicture: replaceUndefined(coverPictureUrl),
        },
      };

      // Sign and broadcast the transaction
      setStatus(SaveProfileStatus.BROADCASTING_TX);
      const signAndBroadcastTxResult = await navigateToSignAndBroadcastTx({
        accountOrAddress: providedAccount ?? activeAccountAddress,
        messages: [msgSaveProfile],
        feeGranter,
        customHeader,
        customBody,
        onSuccess: () => {
          setStatus(SaveProfileStatus.DONE);
        },
        onError: () => {
          setStatus(SaveProfileStatus.UNDEFINED);
        },
      });

      if (signAndBroadcastTxResult.isOk()) {
        onProfileSaved();
        return ok(undefined);
      } else {
        return err(
          signAndBroadcastTxResult.error ??
            new Error('An error occurred while broadcasting the transaction'),
        );
      }
    },
    [activeAccountAddress, navigateToSignAndBroadcastTx, uploadPictures],
  );

  return {
    status,
    saveProfile,
  };
};

export default useSaveProfileOnChain;
