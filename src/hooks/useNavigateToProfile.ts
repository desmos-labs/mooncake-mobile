import React from 'react';
import { useNavigation } from '@react-navigation/native';
import ROUTES from 'navigation/routes';
import { useActiveAccountAddress } from '@recoil/accounts';

/**
 * Hook that allows to navigate to the profile of a user.
 */
const useNavigateToProfile = () => {
  const activeAddress = useActiveAccountAddress();
  const navigation = useNavigation<any>();
  return React.useCallback(
    (address: string, onBeforeNavigation?: () => void) => {
      onBeforeNavigation && onBeforeNavigation();
      if (activeAddress === address) {
        navigation.navigate(ROUTES.USER_PROFILE);
      } else {
        navigation.navigate(ROUTES.GUEST_PROFILE, {
          address,
        });
      }
    },
    [activeAddress, navigation],
  );
};

export default useNavigateToProfile;
