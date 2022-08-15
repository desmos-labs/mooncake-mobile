import React from 'react';
import {
  CameraOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {Asset, ImageLibraryOptions} from 'react-native-image-picker/src/types';
import {Alert} from 'react-native';

const DEFAULT_OPTIONS: ImageLibraryOptions | CameraOptions = {
  mediaType: 'photo',
  includeBase64: true,
};

/**
 * A hook that wraps react-native-image-picker logic and stores the selected
 * image in a useState hook.
 */
const useImageGallery = () => {
  const [image, setImage] = React.useState<Asset>();

  // selecting webp images on ios will return an error code
  const imageFromLibrary = React.useCallback(async () => {
    const result = await launchImageLibrary(DEFAULT_OPTIONS);

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
    const result = await launchCamera(DEFAULT_OPTIONS);
    if (result.errorCode) {
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
    image,
    clearImage,
  };
};

export default useImageGallery;
