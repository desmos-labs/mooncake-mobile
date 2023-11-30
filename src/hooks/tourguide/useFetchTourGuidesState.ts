import { useCachedTourGuide, useSetCachedTourGuide } from '@recoil/tourguide';
import React from 'react';
import * as Sentry from 'sentry-expo';
import GetAccountInfo from 'services/axios/requests/GetAccountData';

/**
 * Hook that provides a function to fetch the tour guide state from the server.
 * If the request fails the function will return the current cached tour guide
 * state.
 */
const useFetchTourGuidesState = () => {
  const setTourGuide = useSetCachedTourGuide();
  const cachedTourGuide = useCachedTourGuide();

  return React.useCallback(async () => {
    let tourGuide = cachedTourGuide;
    const accountInfoResult = await GetAccountInfo();
    if (accountInfoResult.isOk()) {
      tourGuide = {
        ...cachedTourGuide,
        login: accountInfoResult.value.loginTourLastStep,
      };
      setTourGuide(tourGuide);
    } else {
      Sentry.Native.captureException(accountInfoResult.error);
    }
    return tourGuide;
  }, [cachedTourGuide, setTourGuide]);
};

export default useFetchTourGuidesState;
