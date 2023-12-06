import { Constants } from 'config/Constants';
import * as FileSystem from 'expo-file-system';
import { err, ok, Result } from 'neverthrow';
import { Image } from 'react-native-compressor';

/**
 * Function to upload a picture to our server.
 * @param path - Path of the picture to upload.
 * @param bearerToken - Bearer token of the user used to authorize the request.
 */
// eslint-disable-next-line import/prefer-default-export
export const uploadPicture = async (
  path: string,
  bearerToken: string,
): Promise<Result<{ url: string }, Error>> => {
  const compressedImagePath = await Image.compress(path, {
    compressionMethod: 'auto',
  });

  const type = compressedImagePath.substring(
    compressedImagePath.lastIndexOf('.') + 1,
    compressedImagePath.length,
  );
  const response = await FileSystem.uploadAsync(
    `${Constants.apiEndpoint}/media`,
    compressedImagePath,
    {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
      httpMethod: 'POST',
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: 'file',
      mimeType: `image/${type}`,
    },
  );
  const json = JSON.parse(response.body);
  if (json.url !== undefined) {
    return ok({
      url: json.url,
    });
  }
  return err(new Error('Invalid response from server'));
};
