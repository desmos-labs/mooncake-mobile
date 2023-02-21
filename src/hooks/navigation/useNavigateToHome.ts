import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';

/**
 * Hook that returns a function to navigate to the home screen.
 */
const useNavigateToHome = () => {
  const { navigate } = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  return React.useCallback(
    (initialRoute?: ROUTES.HOME_TAB_FOLLOWING | ROUTES.HOME_TAB_DISCOVER) => {
      navigate(ROUTES.BOTTOM_TABS, {
        screen: ROUTES.HOME_TABS,
        params: initialRoute ? { initialRouteName: initialRoute } : undefined,
      });
    },
    [navigate],
  );
};

export default useNavigateToHome;
