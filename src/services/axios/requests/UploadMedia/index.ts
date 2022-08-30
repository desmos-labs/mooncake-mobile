import axiosInstance from 'services/axios';
import {Platform} from 'react-native';
import axios from 'axios';

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
   * Optional callback to listen to the file upload progress.
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
const UploadMedia = async ({fileUri, fileType, onUploadProgress}: Params) => {
  const formData = new FormData();
  formData.append('file', {
    name: 'file',
    fileType,
    uri: Platform.OS === 'android' ? fileUri : fileUri.replace('file://', ''),
  });

  const _response = await axiosInstance.post<Response>('/media', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });

  if (axios.isAxiosError(_response)) {
    throw new Error((_response.response?.data as string) || _response.message);
  } else {
    const {cid, url} = _response.data;

    return {
      cid,
      url,
    };
  }
};

export default UploadMedia;
