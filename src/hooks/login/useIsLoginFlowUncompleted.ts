import { useLoginFlowState } from '@recoil/login';
import React from 'react';
import { LoginFlowStep } from 'types/login';

/**
 * Hook that tells if the user have interrupted the login procedure.
 */
const useIsLoginFlowUncompleted = () => {
  const loginFlowState = useLoginFlowState();

  return React.useMemo(() => {
    return (
      loginFlowState.step !== LoginFlowStep.None && loginFlowState.step !== LoginFlowStep.Completed
    );
  }, [loginFlowState.step]);
};

export default useIsLoginFlowUncompleted;
