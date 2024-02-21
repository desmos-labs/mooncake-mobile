import { parseISO } from 'date-fns';
import useFormatTimeForPostDetails from 'hooks/formatting/useFormatTimeForPostDetails';
import { formatMsToHumanReadable } from 'lib/FormatUtils';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const useTimePassedDate = (creationDate: string) => {
  const { t } = useTranslation('home');
  const formatDate = useFormatTimeForPostDetails();

  const formattedDate = useMemo(() => formatDate(creationDate), [formatDate, creationDate]);

  const date = Date.now();
  return useMemo(() => {
    const parsedTime = parseISO(`${creationDate}Z`);
    const differenceInUnix = date - parsedTime.getTime();
    if (differenceInUnix < 0) {
      return t('now');
    } else if (differenceInUnix < 59999) {
      return t('seconds ago', {
        count: formatMsToHumanReadable(differenceInUnix, 'seconds'),
      });
    } else if (differenceInUnix < 3599999) {
      return t('minutes ago', {
        count: formatMsToHumanReadable(differenceInUnix, 'minutes'),
      });
    } else if (differenceInUnix < 86399999) {
      return t('hours ago', {
        count: formatMsToHumanReadable(differenceInUnix, 'hours'),
      });
    } else if (differenceInUnix < 31556951999) {
      return t('days ago', {
        count: formatMsToHumanReadable(differenceInUnix, 'days'),
      });
    } else {
      return formattedDate;
    }
  }, [creationDate, date, formattedDate, t]);
};

export default useTimePassedDate;
