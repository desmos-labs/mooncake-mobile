import React from 'react';
import { useSetAppStateValue } from '@recoil/appState';
import axiosInstance from 'services/axios';

/**
 * This has to be used to update the bearer token if it changes.
 * Updates the bearer token of the axios instance and also saves it to MMKV storage.
 * @returns (newToken: string) => void - A function that updates the bearer token.
 */
const useUpdateAuthToken = () => {
  /**
   * Sets the authorization token for the axios instance.
   * @param token string - Token that should be used for the authorization.
   */
  const setAuthorizationToken = (token: string) => {
    if (token && token.trim() !== '') {
      axiosInstance.defaults.headers.common = {
        Authorization: `Bearer ${token}`,
      };
    }
  };
  const setToken = useSetAppStateValue('bearerToken');
  return React.useCallback(
    (newToken: string) => {
      setToken(value => {
        const tokenValue = newToken.length > 0 ? newToken : value;
        setAuthorizationToken(tokenValue);
        return tokenValue;
      });
    },
    [setToken],
  );
};

export default useUpdateAuthToken;
