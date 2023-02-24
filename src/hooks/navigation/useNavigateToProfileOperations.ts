import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';

/**
 * Hook that allows to navigate to the profile operations screen.
 */
const useNavigateToProfileOperations = () => {
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const { navigate } = navigation;

  return React.useCallback(
    (address: string) => {
      navigate(ROUTES.PROFILE_OPERATIONS, {
        userAddress: address,
      });
    },
    [navigate],
  );
};

export default useNavigateToProfileOperations;
