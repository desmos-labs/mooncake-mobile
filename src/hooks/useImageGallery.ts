import React from 'react';
import {launchImageLibrary} from 'react-native-image-picker';
import {Asset} from 'react-native-image-picker/src/types';
import {Alert} from 'react-native';

const useImageGallery = () => {
  const [image, setImage] = React.useState<Asset>();

  // selecting webp images on ios will return an error code
  const imageFromLibrary = React.useCallback(async () => {
    try {
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
    } catch (err) {
      console.log(err);
    }
  }, []);

  return {
    imageFromLibrary,
    image,
  };
};

export default useImageGallery;
