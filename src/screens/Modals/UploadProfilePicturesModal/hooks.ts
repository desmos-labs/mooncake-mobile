import React from 'react';
import { UploadMedia, UploadMediaSuccess } from 'services/axios/requests/UploadMedia';
import { Result } from 'neverthrow';
import { Asset } from 'react-native-image-picker';

export enum UploadPictureStateType {
  Unknown,
  Uploading,
  Completed,
  Failed,
}

export interface UnknownUploadState {
  readonly type: UploadPictureStateType.Unknown;
}

export enum PictureType {
  Profile,
  Cover,
}

export interface UploadingPictureState {
  readonly type: UploadPictureStateType.Uploading;
  readonly pictureType: PictureType;
}

export interface UploadPictureCompleted {
  readonly type: UploadPictureStateType.Completed;
  readonly profilePictureUrl?: string;
  readonly coverPictureUrl?: string;
}

export interface UploadPictureFailed {
  readonly type: UploadPictureStateType.Failed;
  readonly pictureType: PictureType;
  readonly error: Error;
}

export type UploadPictureState =
  | UnknownUploadState
  | UploadingPictureState
  | UploadPictureCompleted
  | UploadPictureFailed;

const useUploadPictures = (profilePicture?: Asset, coverPicture?: Asset) => {
  const [uploadState, setUploadState] = React.useState<UploadPictureState>({
    type: UploadPictureStateType.Unknown,
  });

  const uploadPictures = React.useCallback(async () => {
    let uploadProfilePictureResult: Result<UploadMediaSuccess, Error> | undefined;
    let uploadCoverPictureResult: Result<UploadMediaSuccess, Error> | undefined;

    if (profilePicture !== undefined) {
      setUploadState({
        type: UploadPictureStateType.Uploading,
        pictureType: PictureType.Profile,
      });
      uploadProfilePictureResult = await UploadMedia({ mediaFile: profilePicture });

      if (uploadProfilePictureResult.isErr()) {
        setUploadState({
          type: UploadPictureStateType.Failed,
          pictureType: PictureType.Profile,
          error: uploadProfilePictureResult.error,
        });
        return;
      }
    }

    if (coverPicture !== undefined) {
      setUploadState({
        type: UploadPictureStateType.Uploading,
        pictureType: PictureType.Cover,
      });
      uploadCoverPictureResult = await UploadMedia({ mediaFile: coverPicture });

      if (uploadCoverPictureResult.isErr()) {
        setUploadState({
          type: UploadPictureStateType.Failed,
          pictureType: PictureType.Cover,
          error: uploadCoverPictureResult.error,
        });
      }
      return;
    }

    setUploadState({
      type: UploadPictureStateType.Completed,
      coverPictureUrl: uploadCoverPictureResult?.isOk()
        ? uploadCoverPictureResult.value.url
        : undefined,
      profilePictureUrl: uploadProfilePictureResult?.isOk()
        ? uploadProfilePictureResult.value.url
        : undefined,
    });
  }, [profilePicture, coverPicture]);

  React.useEffect(() => {
    uploadPictures();
  }, [uploadPictures]);

  return {
    retry: uploadPictures,
    state: uploadState,
  };
};

export default useUploadPictures;
