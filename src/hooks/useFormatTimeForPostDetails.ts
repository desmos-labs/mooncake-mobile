import React from 'react';
import {useRecoilState} from 'recoil';
import appSettingsState from '@recoil/settings';
import {differenceInYears, parseISO} from 'date-fns';
import {formatInTimeZone} from 'date-fns-tz';

/**
 * A hook that formats an ISO 8601 timestamp into the user's local timezone
 */
const useFormatTimeForPostDetails = (timeToFormat: string) => {
  const [settings] = useRecoilState(appSettingsState);

  return React.useMemo(() => {
    // sanity check, but this should never happen
    if (!timeToFormat) return '';
    // append Z so date-fns can process offsets properly
    // for reference, the time is stored as UTC +0
    const parsedTime = parseISO(`${timeToFormat}Z`);
    if (differenceInYears(new Date(parsedTime), Date.now()) === 0) {
      return formatInTimeZone(
        parsedTime,
        settings.currentTimezone,
        // eg. 20 Apr, 04:20
        'dd MMM, HH:mm',
      );
    }
    return formatInTimeZone(
      parsedTime,
      settings.currentTimezone,
      // eg. Sat Apr 20 2019
      'ccc MMM dd yyyy',
    );
  }, [settings, timeToFormat]);
};

export default useFormatTimeForPostDetails;
