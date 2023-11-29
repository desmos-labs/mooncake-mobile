import { ResultAsync } from 'neverthrow';
import axiosInstance from 'services/axios';
import { TourGuideState } from 'types/tourguide';

/**
 * Sets at which step of a tour the user has arrived.
 */
const SetTourGuideStep = (tourGuideState: Partial<TourGuideState>): ResultAsync<void, Error> => {
  return ResultAsync.fromPromise(
    axiosInstance.put('/me', {
      app_onboarding_last_step: tourGuideState?.login?.toString(),
    }),
    (e: any) => e ?? Error('Error setting tour guide step'),
  );
};

export default SetTourGuideStep;
