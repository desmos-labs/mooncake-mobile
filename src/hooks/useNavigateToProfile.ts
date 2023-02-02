import { useNavigation } from '@react-navigation/native';
import useActiveAccount from 'hooks/useActiveAccount';
import ROUTES from 'navigation/routes';
import { useCallback } from 'react';

const useNavigateToProfile = () => {
  const { activeAddress } = useActiveAccount();
  const navigation = useNavigation<any>();

  const handleNavigateToProfile = useCallback(
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
    [activeAddress],
  );

  return {
    handleNavigateToProfile,
  };
};

export default useNavigateToProfile;
