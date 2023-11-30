import React from 'react';
import * as Sentry from 'sentry-expo';
import { useSetCachedTourGuide } from '@recoil/tourguide';
import SetTourGuideStep from 'services/axios/requests/SetTourStep';
import { TourGuideState } from 'types/tourguide';

/**
 * Hook that provides a function to update the tour guide states.
 * The returned function will update the local application state and
 * the states stored in the server.
 */
const useSetTourGuideStep = () => {
  const setTourGuideStep = useSetCachedTourGuide();

  return React.useCallback(
    async (newState: Partial<TourGuideState>, onlyLocal?: boolean) => {
      setTourGuideStep(prevState => ({
        ...prevState,
        ...newState,
      }));
      if (onlyLocal !== true) {
        const serverRequestResult = await SetTourGuideStep(newState);
        if (serverRequestResult.isErr()) {
          Sentry.Native.captureException(serverRequestResult.error);
        }
      }
    },
    [setTourGuideStep],
  );
};

export default useSetTourGuideStep;
