import ROUTES from 'navigation/routes';
import React from 'react';
import useRootNavigator from './useRootNavigator';

/**
 * Hook that provides a function to reset the navigator to the landing.
 */
const useNavigateToSettings = () => {
  const navigation = useRootNavigator();

  return React.useCallback(() => {
    navigation.navigate(ROUTES.SETTINGS);
  }, [navigation]);
};

export default useNavigateToSettings;
