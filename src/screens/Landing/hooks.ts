import React from 'react';
import useAppFeatureFlags from 'hooks/featureflags/useAppFeatureFlags';
import * as Application from 'expo-application';
import { useLoginFlowState, useSetLoginFlowState } from '@recoil/login';
import { LoginFlowStep } from 'types/login';
import useGoToLoginStep from 'hooks/login/useGoToLoginStep';
import { useActiveAccount } from '@recoil/accounts';

/**
 * Hook that tells if the user have interrupted the login procedure
 * and provides two function one to resume the interrupted the login procedure
 * and another one to cancel it.
 */
export const useResumeLoginFlow = () => {
  const setLoginFlowState = useSetLoginFlowState();
  const loginFlowState = useLoginFlowState();
  const goToLoginStep = useGoToLoginStep();
  const activeAccount = useActiveAccount();

  const pendingLoginFlow = React.useMemo(() => {
    return (
      loginFlowState.step !== LoginFlowStep.None && loginFlowState.step !== LoginFlowStep.Completed
    );
  }, [loginFlowState.step]);

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
    pendingLoginFlow,
    resumeLoginFlow,
    cancelLoginFlow,
  };
};

/**
 * Hook that tells if the application should allow only login with the
 * private key.
 */
export const useIsLoginWithPrivateKeyEnabled = () => {
  const { loginWithPrivateKeyOnVersion } = useAppFeatureFlags();

  return React.useMemo(() => {
    return loginWithPrivateKeyOnVersion === Application.nativeApplicationVersion;
  }, [loginWithPrivateKeyOnVersion]);
};
