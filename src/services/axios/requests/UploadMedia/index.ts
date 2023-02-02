import axiosInstance from 'services/axios';
import {Platform} from 'react-native';
import {Asset} from 'react-native-image-picker';
import {AxiosProgressEvent} from 'axios/index';
import {err, ok, Result} from 'neverthrow';

export type UploadEvent = {
  /**
   * The bytes that have been uploaded to the server.
   */
  loaded: number;

  /**
   * The overall size of the upload.
   */
  total: number;
};

// This can be manually constructed or passed the
// imageAsset from useImageFromDevice hook.
export interface ImageMedia extends Asset {
  uri?: string;
  type?: string;
  fileName?: string;
}

export type UploadAssetType = ImageMedia;

export type UploadMediaParams = {
  /**
   * The media asset to be uploaded.
   * In the future, additional media types should be added here.
   */
  mediaFile: UploadAssetType;

  /**
   * Optional callback to listen to the file upload progress.
   * @params event - The progress update event from axios.
   */
  onUploadProgress?: (event: AxiosProgressEvent) => void;
};

type Response = {
  /**
   * The file's Content Identifier.
   */
  cid: string;

  /**
   * Direct link to the image.
   */
  url: string;
};

/**
 * Represents the result returned after a successful image upload.
 */
export interface UploadMediaSuccess {
  /**
   * URL that should be used to view the image.
   */
  readonly url: string;
}

/**
 * Upload images to centralized storage.
 */
export const UploadMedia = async (
  params: UploadMediaParams,
): Promise<Result<UploadMediaSuccess, Error>> => {
  const {mediaFile, onUploadProgress} = params;
  const {fileName, type, uri} = mediaFile;

  const formData = new FormData();
  formData.append('file', {
    name: fileName,
    type,
    uri: Platform.OS === 'android' ? uri : uri!.replace('file://', ''),
  });

  try {
    const response = await axiosInstance.post<Response>('/media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
      timeout: 15000,
      timeoutErrorMessage: 'Image upload timeout',
    });

    // Return a valid result
    return ok({
      url: response?.data?.url,
    } as UploadMediaSuccess);
  } catch (e: any) {
    if (e.response.status === 413) {
      return err(new Error('Image size is too big'));
    }
    return err(new Error(e.toString()));
  }
};
