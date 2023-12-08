import { Asset } from 'react-native-image-picker';

/**
 * Type that contain the data that represents an image that can be uploaded to the API.
 */
export interface ImageMedia extends Asset {
  uri?: string;
  type?: string;
  fileName?: string;
}

/**
 * Type that represents the asset that can be uploaded to the API.
 */
export type UploadAssetType = ImageMedia;

/**
 * Represents the result returned after a successful image upload.
 */
export interface UploadMediaResponse {
  /**
   * URL that should be used to view the image.
   */
  readonly url: string;
}
