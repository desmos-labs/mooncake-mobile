import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';

/**
 * Hook that allows to navigate either to the following or to the followers screen or a given account.
 */
const useNavigateToFollowageScreen = () => {
  const { navigate } = useNavigation<StackScreenProps<RootNavigatorParamList>['navigation']>();
  return React.useCallback(
    (route: ROUTES.PROFILE_FOLLOWING | ROUTES.PROFILE_FOLLOWERS, userAddress: string) => {
      navigate(ROUTES.PROFILE_FOLLOWING_AND_FOLLOWERS, {
        userAddress,
        initialTabRouteName: route,
      });
    },
    [navigate],
  );
};
export default useNavigateToFollowageScreen;
