import * as ImagePicker from 'expo-image-picker';
import usePermissions from 'hooks/permissions/usePermissions';
import React from 'react';
import { AppPermissionStatus } from 'types/permissions';

const DEFAULT_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: false,
  allowsMultipleSelection: false,
  selectionLimit: 1,
  quality: 1,
};

type Params = {
  /**
   * An optional callback to independently process a selected image.
   */
  onImageSelected?: (imageUri: string) => void;
};

type ReturnValue = {
  /**
   * Select an image from the user's library.
   */
  imageFromLibrary: () => Promise<string | undefined>;
};

/**
 * Hook that allows to select an image from the user's device.
 * @param onImageSelected An optional callback to independently process a selected image.
 */
const useImageFromDevice = ({ onImageSelected }: Params): ReturnValue => {
  const { requestPermission } = usePermissions({
    getMethod: ImagePicker.getMediaLibraryPermissionsAsync,
    requestMethod: ImagePicker.requestMediaLibraryPermissionsAsync,
    get: false,
    request: false,
  });

  // selecting webp images on ios will return an error code
  const imageFromLibrary = React.useCallback(async () => {
    const status = await requestPermission();
    if (status === AppPermissionStatus.Granted) {
      const result = await ImagePicker.launchImageLibraryAsync(DEFAULT_OPTIONS);
      if (result.assets) {
        if (onImageSelected) {
          onImageSelected(result.assets[0].uri);
        }
        return result.assets[0].uri;
      }
    }
  }, [onImageSelected, requestPermission]);

  return {
    imageFromLibrary,
  };
};

export default useImageFromDevice;
