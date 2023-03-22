import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { DesmosProfile } from 'types/desmos';

/**
 * Hook that allows to navigate either to the following or to the followers screen or a given account.
 */
const useNavigateToProfileConnections = () => {
  // We must use push here instead of navigate because we want to be able to go back to the previous screen
  const { push } = useNavigation<StackScreenProps<RootNavigatorParamList>['navigation']>();
  return React.useCallback(
    (
      route: ROUTES.PROFILE_FOLLOWING | ROUTES.PROFILE_FOLLOWERS,
      profile: DesmosProfile | undefined,
    ) => {
      push(ROUTES.PROFILE_CONNECTIONS, {
        profile,
        initialTabRouteName: route,
      });
    },
    [push],
  );
};
export default useNavigateToProfileConnections;
