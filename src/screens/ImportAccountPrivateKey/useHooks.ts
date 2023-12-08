import { DesmosChain } from 'config/LinkableChains';
import useLoginWithPrivateKey from 'hooks/privateKey/useLoginWithPrivateKey';
import React from 'react';

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
