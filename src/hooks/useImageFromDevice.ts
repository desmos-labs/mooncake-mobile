import React from 'react';
import {
  CameraOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {Asset, ImageLibraryOptions} from 'react-native-image-picker/src/types';
import {Alert, Platform} from 'react-native';
import {Permission, PERMISSIONS, request} from 'react-native-permissions';
import ImageResizer from '@bam.tech/react-native-image-resizer';

const DEFAULT_OPTIONS: ImageLibraryOptions | CameraOptions = {
  mediaType: 'photo',
  // don't include base64, as having the uri is enough (for now)
  includeBase64: false,
};

type Params = {
  /**
   * An optional callback to independently process a selected image.
   */
  onImageSelected: (image: Asset) => void;

  /**
   * If true, will not resize the image after one is selected.
   */
  disableResizeImage?: boolean;
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
};

const resizeImages = async (
  selectedImages: Asset[],
  disableResize?: boolean,
): Promise<Asset[]> => {
  if (disableResize) {
    return selectedImages;
  }

  const SIZE_LIMIT = 600;

  const resizedImages = selectedImages.map(async x => {
    // from shotgun debugging, seems like the server limits files to 1mb
    if (x.fileSize! > 1000000) {
      const resized = await ImageResizer.createResizedImage(
        x.uri!,
        SIZE_LIMIT,
        SIZE_LIMIT,
        'PNG',
        100,
      );

      return {
        ...x,
        ...resized,
      };
    }
    return {
      ...x,
    };
  });

  return Promise.all(resizedImages);
};

/**
 * A hook that wraps react-native-image-picker logic and stores the selected
 * image in a useState hook.
 */
const useImageFromDevice = ({
  onImageSelected,
  disableResizeImage,
}: Params): ReturnValue => {
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
      const processedImages = await resizeImages(
        result.assets,
        disableResizeImage,
      );
      onImageSelected(processedImages[0]);
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
      const processedImages = await resizeImages(
        result.assets,
        disableResizeImage,
      );
      onImageSelected(processedImages[0]);
    }
  }, []);

  return {
    imageFromLibrary,
    imageFromCamera,
  };
};

export default useImageFromDevice;
