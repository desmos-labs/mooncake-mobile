import React from 'react';
import { changeWalletsPassword } from 'lib/SecureStorage';

/**
 * A hook that allows the user to change the password of the current active account
 */
const useChangePassword = () => {
  const changePassword = React.useCallback(async (oldPassword: string, newPassword: string) => {
    return changeWalletsPassword(oldPassword, newPassword);
  }, []);

  return {
    changePassword,
  };
};

export default useChangePassword;
