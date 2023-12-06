import { SignAndBroadcastTxParams } from 'services/tasks/SignAndBroadcastTx';
import { DesmosProfile } from 'types/desmos';
import { getTaskContext, TaskJob } from 'lib/BackgroundTaskUtils';
import { DoNotModify, Profiles } from '@desmoslabs/desmjs';
import { MediaPostResponse } from 'hooks/useUploadPicture';
import { err, ok, Result } from 'neverthrow';
import { uploadPicture } from 'lib/UploadUtils';
import { unwrapResult } from 'lib/NeverThrowUtils';

export interface SaveProfileTaskParams extends Omit<SignAndBroadcastTxParams, 'messages'> {
  readonly profile: DesmosProfile;
}

/**
 * Replaces the given possibly undefined value with <code>[do-not-modify]</code>.
 * @param value {string | undefined} Value to be replaced, if undefined.
 */
const replaceUndefined = (value: string | undefined): string => {
  return value ?? DoNotModify;
};

interface ProfilePictureUploadResults {
  readonly profilePictureUrl?: string;
  readonly coverPictureUrl?: string;
}

/**
 * Uploads the given pictures to the Desmos media server.
 * @param profilePicture - Profile picture to be uploaded.
 * @param coverPicture - Cover picture to be uploaded.
 * @param bearerToken - Bearer token to be used to authenticate the request.
 */
const uploadPictures = async (
  profilePicture: string | undefined,
  coverPicture: string | undefined,
  bearerToken: string,
): Promise<Result<ProfilePictureUploadResults, Error>> => {
  let uploadProfilePictureResult: Result<MediaPostResponse, Error> | undefined;
  let uploadCoverPictureResult: Result<MediaPostResponse, Error> | undefined;

  const isProfilePictureToUpload =
    profilePicture !== undefined && profilePicture.startsWith('file://');

  const isCoverPictureToUpload = coverPicture !== undefined && coverPicture.startsWith('file://');

  if (isProfilePictureToUpload) {
    uploadProfilePictureResult = await uploadPicture(profilePicture, bearerToken);
    if (uploadProfilePictureResult.isErr()) {
      return err(uploadProfilePictureResult.error);
    }
  }

  if (isCoverPictureToUpload) {
    uploadCoverPictureResult = await uploadPicture(coverPicture, bearerToken);
    if (uploadCoverPictureResult.isErr()) {
      return err(uploadCoverPictureResult.error);
    }
  }

  return ok({
    profilePictureUrl: uploadProfilePictureResult
      ? unwrapResult(uploadProfilePictureResult).url
      : undefined,
    coverPictureUrl: uploadCoverPictureResult
      ? unwrapResult(uploadCoverPictureResult).url
      : undefined,
  });
};

/**
 * Task that can be executed in the background in order to save the profile.
 * @param params - Parameters required to save the profile.
 * @constructor
 */
const SaveProfileTask: TaskJob<SaveProfileTaskParams, string> = async (
  params: SaveProfileTaskParams,
) => {
  const { desmosClient, signer, memo, profile } = params;
  const { apiBearerToken, broadcastTx } = getTaskContext();

  if (apiBearerToken === undefined) {
    throw new Error('You are not authenticated');
  }

  // Upload the pictures if necessary
  const uploadPictureResult = await uploadPictures(
    profile.profilePicture,
    profile.coverPicture,
    apiBearerToken,
  );
  if (uploadPictureResult.isErr()) {
    return err(uploadPictureResult.error);
  }

  const { profilePictureUrl, coverPictureUrl } = uploadPictureResult.value;

  // Build the message to save the profile on-chain
  const msgSaveProfile: Profiles.v3.MsgSaveProfileEncodeObject = {
    typeUrl: Profiles.v3.MsgSaveProfileTypeUrl,
    value: {
      dtag: replaceUndefined(profile.dTag),
      nickname: replaceUndefined(profile.nickname),
      bio: replaceUndefined(profile.bio),
      profilePicture: replaceUndefined(profilePictureUrl),
      coverPicture: replaceUndefined(coverPictureUrl),
      creator: signer,
    },
  };

  // Sign and broadcast the transaction
  const broadcastTxResult = await broadcastTx(desmosClient, signer, [msgSaveProfile], memo);
  return broadcastTxResult.transactionHash;
};

export default SaveProfileTask;
