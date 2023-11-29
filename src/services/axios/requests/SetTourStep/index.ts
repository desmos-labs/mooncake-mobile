import { ResultAsync } from 'neverthrow';
import axiosInstance from 'services/axios';
import { TourGuideState } from 'types/tourguide';

/**
 * Sets at which step of a tour the user has arived.
 */
const SetTourGuideStep = (tourGudeState: Partial<TourGuideState>): ResultAsync<void, Error> => {
  return ResultAsync.fromPromise(
    axiosInstance.put('/me', {
      app_onboarding_last_step: tourGudeState?.login?.toString(),
      bond_onboarding_last_step: tourGudeState?.bonds?.toString(),
    }),
    (e: any) => e ?? Error('Error settining notification as readed'),
  );
};

export default SetTourGuideStep;
