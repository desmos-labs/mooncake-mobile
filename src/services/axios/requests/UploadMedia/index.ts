import axiosInstance from 'services/axios';
import {Platform} from 'react-native';

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
export type ImageMedia = {
  uri?: string;
  type?: string;
  fileName?: string;
};

export type UploadAssetType = ImageMedia;

export type Params = {
  /**
   * The media asset to be uploaded.
   * In the future, additional media types should be added here.
   */
  mediaFile: UploadAssetType;

  /**
   * Optional callback to listen to the file upload progress.
   * @params event - The progress update event from axios.
   */
  onUploadProgress?: (event: UploadEvent) => void;
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
 * Upload images to web3 storage.
 */
const UploadMedia = async ({mediaFile, onUploadProgress}: Params) => {
  const {fileName, type, uri} = mediaFile;

  const formData = new FormData();
  formData.append('file', {
    name: fileName,
    type,
    uri: Platform.OS === 'android' ? uri : uri!.replace('file://', ''),
  });

  const _response = await axiosInstance.post<Response>('/media', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
    // only resolves if returned status is 200
    validateStatus: status => status === 200,
    timeout: 15000,
    timeoutErrorMessage: 'Image upload timedout',
  });

  return {
    cid: _response?.data?.cid,
    url: _response?.data?.url,
  };
};

export default UploadMedia;
