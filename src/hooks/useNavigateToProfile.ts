import React from 'react';
import { useNavigation } from '@react-navigation/native';
import ROUTES from 'navigation/routes';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { StackNavigationProp } from '@react-navigation/stack';

/**
 * Hook that allows to navigate to the profile of a user.
 */
const useNavigateToProfile = () => {
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  return React.useCallback(
    (address?: string, onBeforeNavigation?: () => void) => {
      // Run any before navigation hook
      if (onBeforeNavigation) {
        onBeforeNavigation();
      }

      switch (address) {
        case undefined:
          navigation.navigate(ROUTES.PROFILE);
          break;
        default:
          navigation.navigate(ROUTES.GUEST_PROFILE, { address });
          break;
      }
    },
    [navigation],
  );
};

export default useNavigateToProfile;
