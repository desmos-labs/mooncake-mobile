import React from 'react';
import {differenceInYears, parseISO} from 'date-fns';
import useFormatDateToTZ from 'hooks/formatting/useFormatDateToTZ';

/**
 * A hook that formats an ISO 8601 timestamp into the user's local timezone
 */
const useFormatTimeForPostDetails = (timeToFormat: string) => {
  const shouldRenderDetailedTime = React.useMemo(() => {
    const parsedTime = parseISO(`${timeToFormat}Z`);
    return differenceInYears(new Date(parsedTime), Date.now()) === 0;
  }, [timeToFormat]);

  return useFormatDateToTZ(
    timeToFormat,
    shouldRenderDetailedTime ? 'dd MMM, HH:mm' : 'ccc MMM dd yyyy',
  );
};

export default useFormatTimeForPostDetails;
