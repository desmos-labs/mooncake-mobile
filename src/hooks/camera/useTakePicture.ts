import * as ImagePicker from 'expo-image-picker';
import { MediaTypeOptions } from 'expo-image-picker';
import usePermissions from 'hooks/permissions/usePermissions';
import React from 'react';
import { AppPermissionStatus } from 'types/permissions';

/**
 * Enum that represents the possible results
 * of the user taking a picture.
 */
export enum TakePictureActionResults {
  /**
   * The user canceled the take picture action.
   */
  Canceled,
  /**
   * The image has been taken.
   */
  Taken,
}

/**
 * Interface that represents a result where the user canceled the
 * take picture action.
 */
export interface TakePictureCanceled {
  readonly status: TakePictureActionResults.Canceled;
}

/**
 * Interface that represents a result where the user
 * took the picture.
 */
export interface TakePictureTaken {
  readonly status: TakePictureActionResults.Taken;
  /**
   * Uri where the picture has been saved.
   */
  readonly uri: string;
}

/**
 * Take picture results type union.
 */
export type TakePictureActionResult = TakePictureCanceled | TakePictureTaken;

/**
 * Hook that provide a function to take a picture with the device camera.
 */
const useTakePicture = () => {
  const { requestPermission } = usePermissions({
    getMethod: ImagePicker.getCameraPermissionsAsync,
    requestMethod: ImagePicker.requestCameraPermissionsAsync,
    get: false,
    request: false,
  });

  return React.useCallback(
    async (cameraType?: ImagePicker.CameraType): Promise<TakePictureActionResult | undefined> => {
      const permissions = await requestPermission();
      if (permissions === undefined) {
        return;
      }
      if (permissions !== AppPermissionStatus.Granted) {
        return;
      }
      const response = await ImagePicker.launchCameraAsync({
        mediaTypes: MediaTypeOptions.Images,
        base64: false,
        exif: false,
        cameraType,
      });
      if (response.canceled || response.assets.length === 0) {
        return {
          status: TakePictureActionResults.Canceled,
        };
      } else {
        return {
          status: TakePictureActionResults.Taken,
          uri: response.assets[0].uri,
        };
      }
    },
    [requestPermission],
  );
};

export default useTakePicture;
