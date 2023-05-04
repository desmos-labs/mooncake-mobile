import React from 'react';

/**
 * A hook that redirects the user to login, allowing a manual refresh of authentication credentials,
 * before redirecting to either the discover or following tabs depending on whether the active address
 * has any followage.
 */
import { useNavigation } from '@react-navigation/native';
import ROUTES from 'navigation/routes';
import useNavigateToHome from 'hooks/navigation/useNavigateToHome';
import useFollowingAddresses from 'hooks/relationships/useFollowingAddresses';

const useLogin = () => {
  const { replace } = useNavigation<any>();
  const navigateToHome = useNavigateToHome();
  const followingAddresses = useFollowingAddresses();

  return React.useCallback(() => {
    replace(ROUTES.LOGIN, {
      onSuccess: () => {
        if (followingAddresses.length > 0) {
          navigateToHome(ROUTES.HOME_TAB_FOLLOWING);
        } else navigateToHome(ROUTES.HOME_TAB_DISCOVER);
      },
    });
  }, [navigateToHome, replace]);
};

export default useLogin;
