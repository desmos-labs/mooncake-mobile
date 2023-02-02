import React, {useState} from 'react';
import UploadMedia, {ImageMedia} from 'services/axios/requests/UploadMedia';
import useUnlockWallet from 'hooks/useUnlockWallet';
import {AccountWithWallet} from 'types/account';
import useSignAndBroadcastTx from 'hooks/useSignAndBroadcastTx';
import {
  DoNotModify,
  MsgSaveProfileEncodeObject,
  MsgSaveProfileTypeUrl,
} from '@desmoslabs/desmjs';

/**
 * Params used to save the profile.
 * Each parameter that is marked as <code>undefined</code> will be replaced
 * with the <code>[do-not-modify]</code> value when building the message
 * to save the profile on-chain.
 */
export interface SaveProfileParams {
  readonly dTag?: string;
  readonly nickname?: string;
  readonly bio?: string;
  readonly profilePicture?: ImageMedia;
  readonly coverPicture?: ImageMedia;
}

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
const useSaveProfile = () => {
  const [status, setStatus] = useState<SaveProfileStatus>(
    SaveProfileStatus.UNDEFINED,
  );
  const unlockWallet = useUnlockWallet();
  const signAndBroadcastTx = useSignAndBroadcastTx();

  const saveProfile = React.useCallback(
    async (
      params: SaveProfileParams,
      providedAccount: AccountWithWallet | undefined,
    ) => {
      const account = providedAccount ?? (await unlockWallet());

      // Upload the profile and cover pictures
      setStatus(SaveProfileStatus.UPLOADING_PICTURES);
      const {coverPicture, profilePicture} = params;
      const [uploadProfilePicResult, uploadCoverPicResult] = await Promise.all([
        profilePicture && UploadMedia({mediaFile: profilePicture}),
        coverPicture && UploadMedia({mediaFile: coverPicture}),
      ]);

      // Build the message to save the profile on-chain
      const {dTag, nickname, bio} = params;
      const msgSaveProfile: MsgSaveProfileEncodeObject = {
        typeUrl: MsgSaveProfileTypeUrl,
        value: {
          creator: account.wallet.address,
          dtag: replaceUndefined(dTag),
          nickname: replaceUndefined(nickname),
          bio: replaceUndefined(bio),
          profilePicture: replaceUndefined(uploadProfilePicResult?.url),
          coverPicture: replaceUndefined(uploadCoverPicResult?.url),
        },
      };

      // Sign and broadcast the transaction
      setStatus(SaveProfileStatus.BROADCASTING_TX);
      const result = await signAndBroadcastTx(account, [msgSaveProfile], {
        useOptimisticAPIs: false,
      });

      // Return the result
      setStatus(SaveProfileStatus.DONE);
      return result;
    },
    [unlockWallet, signAndBroadcastTx],
  );

  return {
    status,
    saveProfile,
  };
};

export default useSaveProfile;
