import { useSetLoginFlowState } from '@recoil/login';
import useTrackLoggedInUser from 'hooks/analytics/useTrackLoggedInUser';
import useTrackProfileCreated from 'hooks/analytics/useTrackProfileCreated';
import useRootNavigator from 'hooks/navigation/useRootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { LoginFlowStep, LoginNavigationAction } from 'types/login';
import { Account } from 'types/account';
import useTrackProfileSelected from 'hooks/analytics/useTrackProfileSelected';

/**
 * Hook that provides a function to go to a specific login step.
 */
const useGoToLoginStep = () => {
  const setLoginFlowState = useSetLoginFlowState();
  const navigation = useRootNavigator();
  const trackProfileCreated = useTrackProfileCreated();
  const trackLoggedInUser = useTrackLoggedInUser();
  const trackProfileSelected = useTrackProfileSelected();

  const navigateToWelcomePage = React.useCallback(() => {
    navigation.navigate(ROUTES.WELCOME_PAGE, {
      action: 'create',
    });
  }, [navigation]);

  const followCreators = React.useCallback(
    (account: Account) => {
      navigation.navigate(ROUTES.FOLLOW_CREATORS, {
        isOnboarding: true,
        onStartBroadcasting: () => {
          setLoginFlowState({
            step: LoginFlowStep.Completed,
          });
          trackProfileSelected();
          trackLoggedInUser(account);
          navigateToWelcomePage();
        },
      });
    },
    [navigateToWelcomePage, navigation, setLoginFlowState, trackLoggedInUser, trackProfileSelected],
  );

  return React.useCallback(
    (action: LoginNavigationAction) => {
      switch (action.step) {
        case LoginFlowStep.RequestFeeGrant:
          setLoginFlowState({ step: action.step });
          navigation.navigate(ROUTES.FEE_GRANT_WAITING_SCREEN, {
            granted: false,
          });
          break;
        case LoginFlowStep.WaitingFeeGrant:
          setLoginFlowState({ step: action.step });
          navigation.navigate(ROUTES.FEE_GRANT_WAITING_SCREEN, {
            granted: true,
          });
          break;
        case LoginFlowStep.CreateProfile:
          setLoginFlowState({ step: action.step });
          navigation.navigate(ROUTES.SAVE_PROFILE, {
            isOnboarding: true,
            blockBackAction: true,
            onProfileSaved: async () => {
              trackProfileCreated();
              followCreators(action.account);
            },
          });
          break;
        case LoginFlowStep.FollowCreators:
          setLoginFlowState({ step: action.step });
          followCreators(action.account);
          break;
        case LoginFlowStep.Completed:
          setLoginFlowState({ step: action.step });
          navigateToWelcomePage();
          break;
      }
    },
    [followCreators, navigateToWelcomePage, navigation, setLoginFlowState, trackProfileCreated],
  );
};

export default useGoToLoginStep;
