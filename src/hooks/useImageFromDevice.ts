import React from 'react';
import {
  CameraOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {Asset, ImageLibraryOptions} from 'react-native-image-picker/src/types';
import {Alert, Platform} from 'react-native';
import {Permission, PERMISSIONS, request} from 'react-native-permissions';

const DEFAULT_OPTIONS: ImageLibraryOptions | CameraOptions = {
  mediaType: 'photo',
  includeBase64: true,
};

type ReturnValue = {
  /**
   * Select an image from the user's library.
   */
  imageFromLibrary: () => void;

  /**
   * Select an image by allowing the user to take a photo.
   */
  imageFromCamera: () => void;

  /**
   * The user's selected image.
   */
  imageAsset: Asset | undefined;

  /**
   * Clears the selected image.
   */
  clearImage: () => void;
};

/**
 * A hook that wraps react-native-image-picker logic and stores the selected
 * image in a useState hook.
 */
const useImageFromDevice = (): ReturnValue => {
  const [image, setImage] = React.useState<Asset>();

  // selecting webp images on ios will return an error code
  const imageFromLibrary = React.useCallback(async () => {
    const result = await launchImageLibrary(DEFAULT_OPTIONS);

    // Temporary error handling
    if (result.errorCode) {
      Alert.alert(
        'Error',
        'Unable to load photo. Please select another photo.',
      );
    } else if (result.assets) {
      setImage(result.assets[0]);
    }
  }, []);

  const imageFromCamera = React.useCallback(async () => {
    const permissions = await request(
      Platform.select({
        ios: PERMISSIONS.IOS.CAMERA,
        android: PERMISSIONS.ANDROID.CAMERA,
      }) as Permission,
    );

    if (permissions !== 'granted') return;

    const result = await launchCamera(DEFAULT_OPTIONS);
    if (result.errorCode) {
      // Temporary error handling
      Alert.alert(
        'Error',
        'Unable to load photo. Please select another photo.',
      );
    } else if (result.assets) {
      setImage(result.assets[0]);
    }
  }, []);

  const clearImage = React.useCallback(() => {
    if (image) setImage(undefined);
  }, [image]);

  return {
    imageFromLibrary,
    imageFromCamera,
    imageAsset: image,
    clearImage,
  };
};

export default useImageFromDevice;
