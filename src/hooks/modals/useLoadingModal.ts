import useRootNavigator from 'hooks/navigation/useRootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { LoadingModalParams } from 'screens/Modals/LoadingModal';

/**
 * Hook that provides a set of functions to show or hide a loading modal.
 */
const useLoadingModal = () => {
  const navigation = useRootNavigator();
  const isDisplayed = React.useRef(false);

  const show = React.useCallback(
    (params: LoadingModalParams) => {
      if (!isDisplayed.current) {
        isDisplayed.current = true;
        navigation.navigate(ROUTES.LOADING_MODAL, params);
      }
    },
    [navigation],
  );

  const hide = React.useCallback(() => {
    if (isDisplayed.current) {
      isDisplayed.current = false;
      navigation.pop();
    }
  }, [navigation]);

  return { show, hide };
};

// Keep this since it may be useful in the future.
// ts-prune-ignore-next
export default useLoadingModal;
