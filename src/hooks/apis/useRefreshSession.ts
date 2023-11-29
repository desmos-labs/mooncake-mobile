import React from 'react';
import { err, ok, Result } from 'neverthrow';
import RefreshSession from 'services/axios/requests/RefreshSession';
import { useAppStateValue } from '@recoil/appState';
import useUpdateAuthToken from 'hooks/axios/useUpdateAuthToken';

/**
 * A hook that restores axios bearer token and redirects the user to the login screen
 * if it is invalid or cannot be found.
 */
const useRefreshSession = () => {
  const bearerToken = useAppStateValue('bearerToken');
  const updateAuthToken = useUpdateAuthToken();
  return React.useCallback(async (): Promise<Result<void, Error>> => {
    // Set the bearer token to the one that is currently stored inside the app state.
    // This is done to ensure that the refresh session request does not fail due to an empty token.
    updateAuthToken(bearerToken);

    // Refresh the session
    const refreshResult = await RefreshSession();
    if (refreshResult.isErr()) {
      return err(refreshResult.error);
    }

    // Update the bearer token
    updateAuthToken(refreshResult.value);

    // Return the ok result
    return ok(undefined);
  }, [bearerToken, updateAuthToken]);
};

export default useRefreshSession;
