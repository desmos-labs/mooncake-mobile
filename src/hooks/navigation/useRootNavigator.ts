import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import NAVIGATORS from 'navigation/navigators';
import React from 'react';

/**
 * Hook that provides the root navigator.
 */
const useRootNavigator = () => {
  const navigator = useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();

  return React.useMemo(() => {
    if (navigator.getId === undefined || navigator.getId() === NAVIGATORS.ROOT) {
      return navigator as NativeStackNavigationProp<RootNavigatorParamList>;
    } else {
      let parent = navigator.getParent();
      while (parent && parent.getId() !== NAVIGATORS.ROOT) {
        parent = parent.getParent();
      }

      if (!parent) {
        throw Error(`Navigator with ID: ${NAVIGATORS.ROOT} not found`);
      }
      return parent as NativeStackNavigationProp<RootNavigatorParamList>;
    }
  }, [navigator]);
};

export default useRootNavigator;
