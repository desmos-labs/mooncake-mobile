import { useCallback, useState } from 'react';
import { AccountWithWallet } from 'types/account';
import useStoreAccount from 'hooks/useStoreAccount';

/**
 * Hook that allows to save an account on the local storage of the device.
 */
const useSaveAccount = () => {
  const storeAccount = useStoreAccount();

  const [savingAccount, setSavingAccount] = useState(false);
  const [saveAccountError, setError] = useState<string>();

  const saveAccount = useCallback(
    async (account: AccountWithWallet, password: string) => {
      setSavingAccount(true);
      setError(undefined);

      const result = await storeAccount(account, password);
      if (result.isErr()) {
        setError(result.error.message);
      }

      setSavingAccount(false);
    },
    [storeAccount],
  );

  return {
    saveAccount,
    savingAccount,
    saveAccountError,
  };
};

export default useSaveAccount;
