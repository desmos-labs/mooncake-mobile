import { useNavigation } from '@react-navigation/native';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import React from 'react';
import ROUTES from 'navigation/routes';
import { SaveProfileParams } from 'screens/SaveProfile';

/**
 * Hooks that provide a function that start a flow that allow the user
 * to create or edit a profile.
 */
const useSaveProfile = () => {
  const { navigate } = useNavigation<StackNavigationProp<RootNavigatorParamList>>();

  return React.useCallback(
    (params?: SaveProfileParams) => {
      navigate(ROUTES.SAVE_PROFILE, params);
    },
    [navigate],
  );
};

export default useSaveProfile;
