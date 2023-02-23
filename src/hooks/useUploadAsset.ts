import React from 'react';
import { UploadAssetType, UploadMedia } from 'services/axios/requests/UploadMedia';

export interface UploadAssetResult {
  readonly uri: string;
  readonly mimeType: string;
}

/**
 * Hook that allows to upload an asset to a remote server, and returns the URL that can be used to reach the attachment.
 */
const useUploadAsset = () => {
  return React.useCallback(async (asset: UploadAssetType) => {
    const uploadResult = await UploadMedia({ mediaFile: asset });
    return uploadResult.map(result => ({
      uri: result.url,
      mimeType: asset.type ?? '', // TODO: Estimate the type here instead of using an empty string
    }));
  }, []);
};

export default useUploadAsset;
