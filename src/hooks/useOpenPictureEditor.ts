import { useCallback } from 'react';
import { Dimensions } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { HEADER_HEIGHT_COMPACT, HEADER_HEIGHT_EXPANDED } from 'screens/Profile';

const useOpenPictureEditor = () => {
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
        cropperToolbarTitle: 'Edit your profile picture',
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
    [],
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
        height: HEADER_HEIGHT_EXPANDED + HEADER_HEIGHT_COMPACT,
        cropperToolbarTitle: 'Edit your cover picture',
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
    [],
  );

  const editPostPicture = useCallback(
    (
      imagePath: string,
      onEditedPicture: (
        editedPicturePath: string,
        dimensions: { width: number; height: number },
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
        cropperToolbarTitle: 'Edit your memory',
        cropperRotateButtonsHidden: true,
        freeStyleCropEnabled: true,
        useCroppedDimensions: true,
        width: Dimensions.get('window').width,
        height: HEADER_HEIGHT_EXPANDED + HEADER_HEIGHT_COMPACT,
      })
        .then(image => {
          onEditedPicture(image.path, { width: image.width, height: image.height });
        })
        .catch(err => {
          onError && onError(err);
        });
    },
    [],
  );

  return {
    editProfilePicture,
    editCoverPicture,
    editPostPicture,
  };
};

export default useOpenPictureEditor;
