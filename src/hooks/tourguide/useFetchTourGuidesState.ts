import { useCachedTourGuide, useSetCachedTourGuide } from '@recoil/tourguide';
import React from 'react';
import * as Sentry from 'sentry-expo';
import GetUserData from 'services/axios/requests/GetUserData';

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
    const accountInfoResult = await GetUserData();
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
