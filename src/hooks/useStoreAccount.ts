import {
  useHasAccount,
  useSetActiveAccountAddress,
  useStoreAccount as usePersistAccount,
} from '@recoil/accounts';
import { useCallback, useMemo } from 'react';
import { AccountWithWallet } from 'types/account';
import {
  deleteItem,
  deleteWallet,
  saveWallet,
  SecureStorageKeys,
  setUserPassword,
} from 'lib/SecureStorage';
import { err, ok, Result } from 'neverthrow';

/**
 * Hook that allows to store an account on the device.
 * This hook will perform all the operations to:
 * - save the wallet on the SecureStorage of the device
 * - save the account on the local storage of the device
 * - set the user password if the stored account is the first one
 *
 * <b>Note</b>
 * This hook only implements the logic of an account storing. If you want
 * the user to properly see the UI, please use <code>useSaveAccount</code> instead.
 */
const useStoreAccount = () => {
  const hasAccount = useHasAccount();
  const savingFirstAccount = useMemo(() => !hasAccount, [hasAccount]);

  const storeAccount = usePersistAccount();
  const setActiveAccountAddress = useSetActiveAccountAddress();

  return useCallback(
    async (account: AccountWithWallet, password: string): Promise<Result<void, Error>> => {
      // Save the wallet on the secure storage
      const result = await saveWallet(account.wallet, password);
      if (result.isErr()) {
        await deleteWallet(account.wallet.address);
        if (savingFirstAccount) {
          await deleteItem(SecureStorageKeys.PASSWORD_CHALLENGE);
        }
        return err(result.error);
      }

      if (savingFirstAccount) {
        // Set the active account address
        setActiveAccountAddress(account.wallet.address);

        // Set the user password
        const passwordResult = await setUserPassword(password);
        if (passwordResult.isErr()) {
          return err(passwordResult.error);
        }
      }

      // Finally, store the account on the local storage
      storeAccount(account.account);
      return ok(undefined);
    },
    [savingFirstAccount, setActiveAccountAddress, storeAccount],
  );
};

export default useStoreAccount;
