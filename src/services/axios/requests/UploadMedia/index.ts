import axiosInstance from 'services/axios';
import {Platform} from 'react-native';
import {AxiosError} from 'axios';

export type Params = {
  /**
   * The image asset to be uploaded. These values are
   */
  imageAsset: {
    uri?: string;
    type?: string;
    fileName?: string;
  };

  /**
   * Optional callback to listen to the file upload progress.
   * @params event - The progress update event from axios.
   */
  onUploadProgress?: (event: {
    isTrusted: boolean;
    lengthComputable: boolean;
    /**
     * The bytes that have been uploaded to the server.
     */
    loaded: number;

    /**
     * The overall size of the upload.
     */
    total: number;
  }) => void;

  /**
   * Optional error handler.
   * @params error - The AxiosError object.
   */
  onError?: (error: AxiosError) => void;
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
const UploadMedia = async ({imageAsset, onUploadProgress, onError}: Params) => {
  const {fileName, type, uri} = imageAsset;

  const formData = new FormData();
  formData.append('file', {
    name: fileName,
    fileType: type,
    uri: Platform.OS === 'android' ? uri : uri!.replace('file://', ''),
  });

  try {
    const _response = await axiosInstance.post<Response>('/media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
      // only resolves if returned status is 200
      validateStatus: status => status === 200,
    });

    return {
      cid: _response?.data?.cid,
      url: _response?.data?.url,
    };
  } catch (err: any | AxiosError) {
    if (onError) {
      onError(err as AxiosError);
    } else {
      throw new Error(err.message);
    }
  }
};

export default UploadMedia;
