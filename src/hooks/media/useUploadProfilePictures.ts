import useUploadPicture, { MediaPostResponse } from 'hooks/useUploadPicture';
import { Result } from 'neverthrow';
import React, { useCallback } from 'react';
import { PictureType, UploadPictureState, UploadPictureStateType } from 'types/uploadPictures';

const useUploadProfilePictures = () => {
  const uploadMedia = useUploadPicture();
  const [uploadState, setUploadState] = React.useState<UploadPictureState>({
    type: UploadPictureStateType.Unknown,
  });

  const uploadPictures = useCallback(
    async (profilePicture?: string, coverPicture?: string) => {
      let uploadProfilePictureResult: Result<MediaPostResponse, Error> | undefined;
      let uploadCoverPictureResult: Result<MediaPostResponse, Error> | undefined;

      const isProfilePictureToUpload =
        profilePicture !== undefined && profilePicture.startsWith('file://');

      const isCoverPictureToUpload =
        coverPicture !== undefined && coverPicture.startsWith('file://');

      if (isProfilePictureToUpload) {
        setUploadState({
          type: UploadPictureStateType.Uploading,
          pictureType: PictureType.Profile,
        });
        uploadProfilePictureResult = await uploadMedia(profilePicture);
        if (uploadProfilePictureResult.isErr()) {
          setUploadState({
            type: UploadPictureStateType.Failed,
            pictureType: PictureType.Profile,
            error: uploadProfilePictureResult.error,
          });
          return;
        }
      }

      if (isCoverPictureToUpload) {
        setUploadState({
          type: UploadPictureStateType.Uploading,
          pictureType: PictureType.Cover,
        });
        uploadCoverPictureResult = await uploadMedia(coverPicture);
        if (uploadCoverPictureResult.isErr()) {
          setUploadState({
            type: UploadPictureStateType.Failed,
            pictureType: PictureType.Cover,
            error: uploadCoverPictureResult.error,
          });
          return;
        }
      }

      setUploadState({
        type: UploadPictureStateType.Completed,
        coverPictureUrl: uploadCoverPictureResult?.isOk()
          ? uploadCoverPictureResult.value.url
          : isCoverPictureToUpload
            ? undefined
            : coverPicture,
        profilePictureUrl: uploadProfilePictureResult?.isOk()
          ? uploadProfilePictureResult.value.url
          : isProfilePictureToUpload
            ? undefined
            : profilePicture,
      });
      return {
        coverPictureUrl: uploadCoverPictureResult?.isOk()
          ? uploadCoverPictureResult.value.url
          : undefined,
        profilePictureUrl: uploadProfilePictureResult?.isOk()
          ? uploadProfilePictureResult.value.url
          : undefined,
      };
    },
    [uploadMedia],
  );

  return {
    uploadState,
    uploadPictures,
  };
};

export default useUploadProfilePictures;
