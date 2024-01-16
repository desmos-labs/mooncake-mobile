import { useCallback, useMemo } from 'react';
import useResetToHome from 'hooks/navigation/useResetToHome';
import useRootNavigator from './useRootNavigator';

export interface ReturnToCurrentScreenParams {
  /**
   * If `true` when the current screen is missing
   * from the navigator instance the navigator will be
   * reset to the home screen.
   */
  onMissingScreenResetToHome?: boolean;
  /**
   * If `true` when the current screen is missing
   * from the navigator instance we just go back to the
   * previous screen.
   */
  onMissingScreenGoBack?: boolean;
}

const useReturnToCurrentScreen = (params?: ReturnToCurrentScreenParams) => {
  // We need the root navigator instance to save the current navigator state
  // othewise we may navigate to the wrong screen.
  const navigator = useRootNavigator();
  const resetToHomeScreen = useResetToHome();

  const startingScreenNavigateParams = useMemo(() => {
    if (!navigator.getState()) return undefined;
    const { routes } = navigator.getState();
    const currentRoute = routes[routes.length - 1];
    return { key: currentRoute.key, params: currentRoute.params };
  }, [navigator]);

  return useCallback(() => {
    const canNavigate = navigator
      .getState()
      ?.routes?.some(r => r.key === startingScreenNavigateParams?.key);
    if (startingScreenNavigateParams && canNavigate) {
      navigator.navigate(startingScreenNavigateParams as any);
    } else if (!canNavigate) {
      if (params?.onMissingScreenResetToHome === true) {
        resetToHomeScreen();
      } else if (params?.onMissingScreenGoBack === true) {
        navigator.goBack();
      }
    }
  }, [
    navigator,
    params?.onMissingScreenResetToHome,
    params?.onMissingScreenGoBack,
    resetToHomeScreen,
    startingScreenNavigateParams,
  ]);
};

export default useReturnToCurrentScreen;
