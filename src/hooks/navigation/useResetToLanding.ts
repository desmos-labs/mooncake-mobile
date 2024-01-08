import React from 'react';
import ROUTES from 'navigation/routes';
import useRootNavigator from './useRootNavigator';

/**
 * Hook that provides a function to reset the navigator to the landing.
 */
const useResetToLanding = () => {
  const navigation = useRootNavigator();

  return React.useCallback(() => {
    navigation.reset({
      index: __DEV__ ? 1 : 0,
      routes: __DEV__
        ? [
            {
              name: ROUTES.DEV_SCREEN,
            },
            {
              name: ROUTES.LANDING,
            },
          ]
        : [
            {
              name: ROUTES.LANDING,
            },
          ],
    });
  }, [navigation]);
};

export default useResetToLanding;
