import axiosInstance from 'services/axios';
import {Platform} from 'react-native';
import {AxiosError} from 'axios';

export type Params = {
  /**
   * The URI to the file being uploaded.
   * Ideally, it should be the result of the <Asset> type from
   * react-native-image-picker
   */
  fileUri: string;

  /**
   * The type of the file being uploaded.
   */
  fileType: string;

  /**
   * The name of the file.
   */
  fileName: string;

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
 * Refresh the user's token validity
 */
const UploadMedia = async ({
  fileUri,
  fileType,
  fileName,
  onUploadProgress,
  onError,
}: Params) => {
  const formData = new FormData();
  formData.append('file', {
    name: fileName,
    fileType,
    uri: Platform.OS === 'android' ? fileUri : fileUri.replace('file://', ''),
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
