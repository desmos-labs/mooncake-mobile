import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';

type HomeTabs = ROUTES.HOME_TABS | ROUTES.HOME_TAB_DISCOVER | ROUTES.HOME_TAB_FOLLOWING;

/**
 * Hook that provides a function to reset the navigator to the home.
 */
const useResetToHome = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();

  return React.useCallback(
    (tab?: HomeTabs) => {
      navigation.reset({
        index: __DEV__ ? 1 : 0,
        routes: __DEV__
          ? [
              {
                name: ROUTES.DEV_SCREEN,
              },
              {
                name: ROUTES.BOTTOM_TABS,
                params: {
                  screen: tab,
                },
              },
            ]
          : [
              {
                name: ROUTES.BOTTOM_TABS,
                params: {
                  screen: tab,
                },
              },
            ],
      });
    },
    [navigation],
  );
};

export default useResetToHome;
