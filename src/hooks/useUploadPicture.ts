import React from 'react';
import { Result } from 'neverthrow';
import { useAppStateValue } from '@recoil/appState';
import { uploadPicture } from 'lib/UploadUtils';

export type MediaPostResponse = {
  url: string;
};

/**
 * Hooks that provides a function to upload a picture to the APIs /media endpoint.
 * @returns A function that takes a path to a picture and returns a promise that resolves to a Result<MediaPostResponse, Error>.
 */
const useUploadPicture = (): ((uriPath: string) => Promise<Result<MediaPostResponse, Error>>) => {
  const token = useAppStateValue('bearerToken');

  return React.useCallback(
    async (path: string): Promise<Result<MediaPostResponse, Error>> => {
      return uploadPicture(path, token);
    },
    [token],
  );
};

export default useUploadPicture;
