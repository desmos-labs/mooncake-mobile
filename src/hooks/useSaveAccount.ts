import React from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { AccountWithWallet } from 'types/account';
import ROUTES from 'navigation/routes';
import { PASSWORD_MANIPULATION_MODE } from 'screens/PasswordManipulation';

const useSaveAccount = () => {
  const navigation = useNavigation<NavigationProp<RootNavigatorParamList>>();

  return React.useCallback((account: AccountWithWallet, password?: string) => {
    if (password === undefined) {
      navigation.navigate(ROUTES.PASSWORD_MANIPULATION, {
        mode: PASSWORD_MANIPULATION_MODE.SETUP_PASSWORD,
        account,
      });
    } else {
      navigation.navigate(ROUTES.SAVE_ACCOUNT, {
        account: account.account,
        wallet: account.wallet,
        password,
      });
    }
  }, []);
};

export default useSaveAccount;
