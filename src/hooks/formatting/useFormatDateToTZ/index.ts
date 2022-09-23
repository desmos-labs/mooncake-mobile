import React from 'react';
import {useRecoilState} from 'recoil';
import {formatInTimeZone} from 'date-fns-tz';
import {parseISO} from 'date-fns';
import appSettingsState from '@recoil/settings';

/**
 * A hook that formats a timestamp into a specified format, to the user's stored
 * timezone
 *
 * @param {string} timeToFormat The timestring to format
 * @param {string} formatString The specified date-fns to format the time into
 *                              See {https://date-fns.org/v2.29.3/docs/format}
 */
const useFormatDateToTZ = (timeToFormat: string, formatString: string) => {
  const [settings] = useRecoilState(appSettingsState);

  return React.useMemo(() => {
    if (!timeToFormat) return '';
    // append a zone designator to timestamp if it is not present
    // this is for formatting the time to different timezones
    const parsedTime = parseISO(
      !timeToFormat.includes('Z') ? `${timeToFormat}Z` : timeToFormat,
    );

    return formatInTimeZone(parsedTime, settings.currentTimezone, formatString);
  }, [timeToFormat, settings.currentTimezone]);
};

export default useFormatDateToTZ;
