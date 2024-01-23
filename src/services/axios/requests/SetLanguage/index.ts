import { ResultAsync } from 'neverthrow';
import axiosInstance from 'services/axios';

/**
 * Sets the language of the user.
 */
const SetLanguage = (languageIsoCode: string): ResultAsync<void, Error> => {
  return ResultAsync.fromPromise(
    axiosInstance.put('/me', {
      language_iso_code: languageIsoCode,
    }),
    (e: any) => e ?? Error('Error setting language'),
  );
};

export default SetLanguage;
