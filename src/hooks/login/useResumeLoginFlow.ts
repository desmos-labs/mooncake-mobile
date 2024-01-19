import { useLoginFlowState, useSetLoginFlowState } from '@recoil/login';
import React from 'react';
import { useActiveAccount } from '@recoil/accounts';
import { LoginFlowStep } from 'types/login';
import useGoToLoginStep from './useGoToLoginStep';

/**
 * Hook that provides two function one to resume an
 * interrupted the login procedure
 * and another one to cancel it.
 */
const useResumeLoginFlow = () => {
  const setLoginFlowState = useSetLoginFlowState();
  const loginFlowState = useLoginFlowState();
  const goToLoginStep = useGoToLoginStep();
  const activeAccount = useActiveAccount();

  const resumeLoginFlow = React.useCallback(() => {
    switch (loginFlowState.step) {
      case LoginFlowStep.Completed:
      case LoginFlowStep.None:
        return;
      case LoginFlowStep.CreateProfile:
      case LoginFlowStep.FollowCreators:
        goToLoginStep({ step: loginFlowState.step, account: activeAccount! });
        break;
      case LoginFlowStep.RequestFeeGrant:
      case LoginFlowStep.WaitingFeeGrant:
        goToLoginStep({ step: loginFlowState.step });
        break;
    }
  }, [activeAccount, goToLoginStep, loginFlowState.step]);

  const cancelLoginFlow = React.useCallback(() => {
    setLoginFlowState({
      step: LoginFlowStep.None,
    });
  }, [setLoginFlowState]);

  return {
    resumeLoginFlow,
    cancelLoginFlow,
  };
};

export default useResumeLoginFlow;
