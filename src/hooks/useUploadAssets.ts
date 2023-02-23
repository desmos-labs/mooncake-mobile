import React from 'react';
import { UploadAssetType } from 'services/axios/requests/UploadMedia';
import { ok } from 'neverthrow';
import useUploadAsset, { UploadAssetResult } from 'hooks/useUploadAsset';

/**
 * Hook that allows to upload assets to a remote server, and returns the URLs that can be used to reach each attachment.
 */
const useUploadAssets = () => {
  const uploadAsset = useUploadAsset();

  return React.useCallback(
    async (assets: UploadAssetType[]) => {
      const results: UploadAssetResult[] = [];

      // It's not possible to use Promise.all here because we want to stop the upload as soon as one of the uploads fails
      // eslint-disable-next-line no-restricted-syntax
      for (const asset of assets) {
        // We need to disable the no-await-in-loop rule because we need to wait for each upload to finish before starting the next one
        // eslint-disable-next-line no-await-in-loop
        const result = await uploadAsset(asset);
        if (result.isErr()) {
          return result;
        }
        results.push(result.value);
      }

      return ok(results);
    },
    [uploadAsset],
  );
};

export default useUploadAssets;
