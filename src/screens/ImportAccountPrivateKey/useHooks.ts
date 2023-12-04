import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DesmosChain } from 'config/LinkableChains';
import useLoginWithPrivateKey from 'hooks/privateKey/useLoginWithPrivateKey';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';

export type NavProps = NativeStackScreenProps<
  RootNavigatorParamList,
  ROUTES.IMPORT_ACCOUNT_PRIVATE_KEY
>;

const useHooks = () => {
  const { login, loginLoading } = useLoginWithPrivateKey(DesmosChain);

  // Initial form values
  const initialFormValues = React.useMemo(
    () => ({
      privateKey: '',
    }),
    [],
  );

  const handleFormSubmit = React.useCallback(
    async (formValues: typeof initialFormValues) => {
      await login(formValues.privateKey.trim());
    },
    [login],
  );

  return {
    handleFormSubmit,
    initialFormValues,
    loginLoading,
  };
};

export default useHooks;
