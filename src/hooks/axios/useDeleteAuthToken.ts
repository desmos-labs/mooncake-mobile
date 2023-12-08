import React from 'react';
import { useSetAppStateValue } from '@recoil/appState';
import axiosInstance from 'services/axios';

const useDeleteAuthToken = () => {
  const setToken = useSetAppStateValue('bearerToken');
  return React.useCallback(() => {
    setToken('');
    axiosInstance.defaults.headers.common = {
      Authorization: '',
    };
  }, [setToken]);
};

export default useDeleteAuthToken;
