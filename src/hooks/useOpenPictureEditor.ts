import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {
  PROFILE_HEADER_HEIGHT_COMPACT,
  PROFILE_HEADER_HEIGHT_EXPANDED,
} from 'screens/Profile/useStyles';

const useOpenPictureEditor = () => {
  const { t } = useTranslation('pictureEditor');

  const editProfilePicture = useCallback(
    (
      imagePath: string,
      onEditedPicture: (editedPicturePath: string) => void,
      onError?: (err: any) => void,
    ) => {
      ImagePicker.openCropper({
        path: imagePath,
        mediaType: 'photo',
        waitAnimationEnd: true,
        cropperCircleOverlay: true,
        freeStyleCropEnabled: true,
        cropperStatusBarColor: 'black',
        cropperToolbarColor: 'black',
        cropperToolbarWidgetColor: 'white',
        cropperActiveWidgetColor: 'purple',
        showCropGuidelines: false,
        showCropFrame: false,
        hideBottomControls: true,
        cropperToolbarTitle: t('edit your profile picture'),
        cropperRotateButtonsHidden: true,
        useCroppedDimensions: true,
      })
        .then(image => {
          onEditedPicture(image.path);
        })
        .catch(err => {
          onError && onError(err);
        });
    },
    [t],
  );

  const editCoverPicture = useCallback(
    (
      imagePath: string,
      onEditedPicture: (editedPicturePath: string) => void,
      onError?: (err: any) => void,
    ) => {
      ImagePicker.openCropper({
        path: imagePath,
        mediaType: 'photo',
        waitAnimationEnd: true,
        cropperStatusBarColor: 'black',
        cropperToolbarColor: 'black',
        cropperToolbarWidgetColor: 'white',
        cropperActiveWidgetColor: 'purple',
        showCropGuidelines: true,
        showCropFrame: true,
        hideBottomControls: true,
        width: Dimensions.get('window').width,
        height: PROFILE_HEADER_HEIGHT_COMPACT + PROFILE_HEADER_HEIGHT_EXPANDED,
        cropperToolbarTitle: t('edit your cover picture'),
        cropperRotateButtonsHidden: true,
        useCroppedDimensions: true,
      })
        .then(image => {
          onEditedPicture(image.path);
        })
        .catch(err => {
          onError && onError(err);
        });
    },
    [t],
  );

  const editPostPicture = useCallback(
    (
      imagePath: string,
      onEditedPicture: (
        editedPicturePath: string,
        dimensions: { width: number; height: number },
        mimeType: string,
      ) => void,
      onError?: (err: any) => void,
    ) => {
      ImagePicker.openCropper({
        path: imagePath,
        mediaType: 'photo',
        waitAnimationEnd: true,
        cropperStatusBarColor: 'black',
        cropperToolbarColor: 'black',
        cropperToolbarWidgetColor: 'white',
        cropperActiveWidgetColor: 'purple',
        showCropGuidelines: true,
        showCropFrame: true,
        hideBottomControls: true,
        cropperToolbarTitle: t('edit your picture'),
        cropperRotateButtonsHidden: true,
        freeStyleCropEnabled: true,
        useCroppedDimensions: true,
        width: Dimensions.get('window').width,
        height: (Dimensions.get('window').width * 10) / 16,
      })
        .then(image => {
          onEditedPicture(image.path, { width: image.width, height: image.height }, image.mime);
        })
        .catch(err => {
          onError && onError(err);
        });
    },
    [t],
  );

  return {
    editProfilePicture,
    editCoverPicture,
    editPostPicture,
  };
};

export default useOpenPictureEditor;
