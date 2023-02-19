import React from 'react';
import { formatInTimeZone } from 'date-fns-tz';
import { parseISO } from 'date-fns';
import { useAppStateValue } from '@recoil/appState';

/**
 * A hook that allows formatting a timestamp into a specified format.
 */
const useFormatDateToTZ = () => {
  const currentTimeZone = useAppStateValue('currentTimezone');
  return React.useCallback(
    (timeToFormat: string, formatString: string) => {
      if (!timeToFormat) return '';
      // append a zone designator to timestamp if it is not present
      // this is for formatting the time to different timezones
      const parsedTime = parseISO(!timeToFormat.includes('Z') ? `${timeToFormat}Z` : timeToFormat);
      return formatInTimeZone(parsedTime, currentTimeZone, formatString);
    },
    [currentTimeZone],
  );
};

export default useFormatDateToTZ;
