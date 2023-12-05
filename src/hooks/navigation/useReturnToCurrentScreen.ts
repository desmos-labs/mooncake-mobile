import { useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useResetToHome from 'hooks/navigation/useResetToHome';

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
  const navigator = useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();
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
