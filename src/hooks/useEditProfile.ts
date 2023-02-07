import { DesmosProfile } from 'types/desmos';
import { useActiveAccountAddress } from '@recoil/activeAccount';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import { RootNavigatorParamList } from 'navigation/RootNavigator';

export interface EditProfileOptions {
  /**
   * Account that is editing or creating the profile.
   * If is undefined will be used the current active account.
   */
  account?: string;
  /**
   * Profile to edit, if undefined will create a new profile.
   */
  profile?: DesmosProfile;
  /**
   * Tells if the profile is just saved in the local device storage or if after
   * creating it will be broadcast on chain.
   * If undefined will this field will be considered false.
   */
  isLocalOnly?: boolean;
  /**
   * Callback called if the profile has been correctly created.
   */
  onSuccess: (profile: DesmosProfile) => any;
  /**
   * Callback called if the user cancelled the profile edit.
   */
  onCancel?: () => any;
}

/**
 * Hooks that allow the creation or modification of the Desmos profile associated
 * to an account.
 */
const useEditProfile = () => {
  const activeAccount = useActiveAccountAddress();
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();

  return React.useCallback(
    (options: EditProfileOptions) => {
      const account = options?.account ?? activeAccount;
      if (account === undefined) {
        throw new Error('is required an active account if is not specified an account address');
      }

      // TODO: Implement account editing.
    },
    [activeAccount, navigation],
  );
};

export default useEditProfile;
