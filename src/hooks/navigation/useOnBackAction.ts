import { DependencyList, useCallback, useEffect, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { isGoBackEvent } from 'lib/EventUtils';
import { BeforeRemoveEventArgs } from 'types/events';

type BackCallback = (event: BeforeRemoveEventArgs) => any | (() => any);

/**
 * Hook that execute the provided callback when the user go back from the current screen.
 * @param onBack - Callback called when the user press the back button.
 * @param deps - Deps that are used inside the {@param onBack} callback.
 */
const useOnBackAction = (onBack: BackCallback, deps: DependencyList) => {
  const navigation = useNavigation();
  const memoizedBackCallback = useCallback(onBack, [...deps]);

  const currentScreen = useMemo(() => {
    const { routes } = navigation.getState();
    return routes[routes.length - 1];
  }, [navigation]);

  useEffect(() => {
    return navigation.addListener('beforeRemove', (e: BeforeRemoveEventArgs) => {
      // Call the back action only when the go back action source is the current screen,
      // this is to prevent executing the callback when is another screen that
      // originated the event.
      if (isGoBackEvent(e) && e.target === currentScreen.key) {
        memoizedBackCallback(e);
      }
    });
  });
};

export default useOnBackAction;
