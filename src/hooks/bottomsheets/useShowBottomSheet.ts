import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';

/**
 * Hook that provides a set of function to show and hide a bottom sheet.
 */
export default function useShowBottomSheet() {
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();

  const show = React.useCallback(
    <P>(component: React.FC<P>, props?: P) => {
      navigation.navigate(ROUTES.BOTTOM_SHEET, {
        component,
        props,
      });
    },
    [navigation],
  );

  const hide = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return { show, hide };
}
