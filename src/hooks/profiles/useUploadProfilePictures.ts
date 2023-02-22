import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import React from 'react';
import useReturnToCurrentScreen from 'hooks/navigation/useReturnToCurrentScreen';
import Routes from 'navigation/routes';
import { DesmosProfile } from 'types/desmos';
import { isPictureAsset } from 'lib/ProfileUtils';
import { CanceledOperationError } from 'types/error';
import { UploadPicturesSuccess } from 'screens/Modals/UploadProfilePicturesModal';
import { err, ok, Result } from 'neverthrow';

/**
 * Hook that provides a function to upload the user's profile pictures to ipfs
 * showing the upload status in a modal.
 */
const useUploadProfilePictures = () => {
  const navigator = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const returnToCurrentScreen = useReturnToCurrentScreen();

  return React.useCallback(
    (profile: DesmosProfile): Promise<Result<UploadPicturesSuccess, CanceledOperationError>> => {
      const toUploadProfilePicture = isPictureAsset(profile.profilePicture)
        ? profile.profilePicture
        : undefined;
      const toUploadCoverPictureAsset = isPictureAsset(profile.coverPicture)
        ? profile.coverPicture
        : undefined;

      // Return immediately if there is nothing to upload.
      if (toUploadProfilePicture === undefined && toUploadCoverPictureAsset === undefined) {
        return Promise.resolve(
          ok({
            profilePictureUrl: undefined,
            coverPictureUrl: undefined,
          }),
        );
      }

      return new Promise(resolve => {
        navigator.navigate(Routes.UPLOAD_PROFILE_PICTURES_MODALS, {
          profilePicture: toUploadProfilePicture,
          coverPicture: toUploadCoverPictureAsset,
          onUploadSuccess: uploadResult => {
            returnToCurrentScreen();
            resolve(ok(uploadResult));
          },
          onCancel: () => {
            resolve(err(new CanceledOperationError()));
          },
        });
      });
    },
    [navigator, returnToCurrentScreen],
  );
};

export default useUploadProfilePictures;
