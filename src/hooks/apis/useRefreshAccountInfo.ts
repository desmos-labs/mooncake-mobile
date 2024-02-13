import React from 'react';
import { useStoreAccountInfo } from '@recoil/accountInfo';
import GetUserData from 'services/axios/requests/GetUserData';
import { ok } from 'neverthrow';

/**
 * Hook that provides a function to refresh the account information.
 */
const useRefreshAccountInfo = () => {
  const setAccountInfo = useStoreAccountInfo();

  return React.useCallback(async () => {
    return GetUserData().andThen(accountInfo => {
      setAccountInfo(accountInfo);
      return ok(undefined);
    });
  }, [setAccountInfo]);
};

export default useRefreshAccountInfo;
