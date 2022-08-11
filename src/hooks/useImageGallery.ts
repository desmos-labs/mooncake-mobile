import React from 'react';
import {launchImageLibrary} from 'react-native-image-picker';
import {Asset} from 'react-native-image-picker/src/types';
import {Alert} from 'react-native';

/**
 * A hook that wraps react-native-image-picker logic and stores the selected
 * image in a useState hook.
 */
const useImageGallery = () => {
  const [image, setImage] = React.useState<Asset>();

  // selecting webp images on ios will return an error code
  const imageFromLibrary = React.useCallback(async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
    });

    if (result.errorCode) {
      Alert.alert(
        'Error',
        'Unable to load photo. Please select another photo.',
      );
    } else if (result.assets) {
      setImage(result.assets[0]);
    }
  }, []);

  return {
    imageFromLibrary,
    image,
  };
};

export default useImageGallery;
