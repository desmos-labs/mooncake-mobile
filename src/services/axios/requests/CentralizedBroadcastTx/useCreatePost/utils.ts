import UploadMedia, { UploadMediaParams } from 'services/axios/requests/UploadMedia';

/**
 * Uploads an image and returns an object that is compatible with the Media.fromPartial helper function.
 */
// eslint-disable-next-line import/prefer-default-export
export const uploadImageForPost = async ({
  mediaFile,
  onUploadProgress,
}: UploadMediaParams): Promise<
  { uri: string; mimeType: string; size: { width: number; height: number } } | undefined
> => {
  try {
    const uploadResponse = await UploadMedia({
      mediaFile,
      onUploadProgress,
    });

    const { url } = uploadResponse!;

    const { type } = mediaFile;

    return {
      uri: url,
      mimeType: type || '',
      size: {
        width: mediaFile.width || 0,
        height: mediaFile.height || 0,
      },
    };
  } catch (err: any) {
    if (err.toString().includes('413')) {
      throw new Error('Error 413 from server: Image too large');
    }
    throw new Error(err.toString());
  }
};
