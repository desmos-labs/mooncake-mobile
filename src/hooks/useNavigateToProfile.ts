import React from 'react';
import { useNavigation } from '@react-navigation/native';
import ROUTES from 'navigation/routes';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { GuestProfileParams } from 'screens/GuestProfile';

/**
 * Hook that allows to navigate to the profile of a user.
 */
const useNavigateToProfile = () => {
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  return React.useCallback(
    (params?: GuestProfileParams, onBeforeNavigation?: () => void) => {
      // Run any before navigation hook
      if (onBeforeNavigation) {
        onBeforeNavigation();
      }

      // Navigate to the proper screen
      switch (params) {
        case undefined:
          navigation.navigate(ROUTES.USER_PROFILE);
          break;
        default:
          navigation.navigate(ROUTES.GUEST_PROFILE, params);
          break;
      }
    },
    [navigation],
  );
};

export default useNavigateToProfile;
