import React from 'react';
import { useTranslation } from 'react-i18next';
import useInterval from 'hooks/useInterval';

const useConnectInstructions = (countdownEnabled: boolean) => {
  const { t } = useTranslation('connectToLedger');

  const [instructionsIndex, setInstructionsIndex] = React.useState(0);

  useInterval(() => {
    if (countdownEnabled) {
      setInstructionsIndex(prev => prev + 1);
    }
  }, 3000);

  const instruction = React.useMemo(() => {
    return t('connectInstructions', {
      returnObjects: true,
    })[instructionsIndex % 2];
  }, [instructionsIndex]);

  return { instruction, instructionsIndex };
};

export default useConnectInstructions;
