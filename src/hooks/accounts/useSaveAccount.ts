import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import React from 'react';
import { AccountWithWallet } from 'types/account';

/**
 * Hook that allows to save a new account by taking the user to the proper in-app screen.
 *
 * If no <code>password</code> is provided, then the user will be taken to the screen allowing
 * them to setup their device password before storing the account on the device.
 *
 * If a <code>password<code> is provided, then the user will skip the password setup screen.
 *
 * <b>Note</b>
 * If any case, at the end of the account saving procedure, the user will be taken to the
 * home page of the application. If you don't want this to happen, but you want to manage
 * the navigation by hand, use {@link useStoreAccount} instead.
 */
const useSaveAccount = () => {
  const navigation = useNavigation<NavigationProp<RootNavigatorParamList>>();
  return React.useCallback(
    (account: AccountWithWallet, password?: string) => {
      /*      if (password === undefined) {
       navigation.navigate(ROUTES.PASSWORD_MANIPULATION, {
       mode: PASSWORD_MANIPULATION_MODE.SETUP_PASSWORD,
       account,
       });
       } else {
       navigation.navigate(ROUTES.IMPORT_ACCOUNT_SAVE_ACCOUNT, {
       account: account.account,
       wallet: account.wallet,
       password,
       });
       } */
    },
    [navigation],
  );
};

export default useSaveAccount;
