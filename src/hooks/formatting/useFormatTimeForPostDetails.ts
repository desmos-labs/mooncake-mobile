import React from 'react';
import { differenceInYears, parseISO } from 'date-fns';
import useFormatDateToTZ from 'hooks/formatting/useFormatDateToTZ';

/**
 * A hook that formats an ISO 8601 timestamp into the user's local timezone
 */
const useFormatTimeForPostDetails = () => {
  const formatDateToTZ = useFormatDateToTZ();
  return React.useCallback(
    (timeToFormat: string, forceRenderCollapsedtime?: boolean) => {
      const parsedTime = parseISO(`${timeToFormat}Z`);
      const shouldRenderDetailedTime = differenceInYears(new Date(parsedTime), Date.now()) === 0;
      return formatDateToTZ(
        timeToFormat,
        shouldRenderDetailedTime && !forceRenderCollapsedtime ? 'dd MMM, HH:mm' : 'dd MMM, yyyy',
      );
    },
    [formatDateToTZ],
  );
};

export default useFormatTimeForPostDetails;
