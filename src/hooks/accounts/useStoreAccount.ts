import { useCallback, useMemo } from 'react';
import { err, ok, Result } from 'neverthrow';
import {
  useHasAccount,
  useSetActiveAccountAddress,
  useStoreAccount as usePersistAccount,
} from '@recoil/accounts';
import { AccountWithWallet } from 'types/account';
import {
  deleteItem,
  deleteWallet,
  saveWallet,
  SecureStoreKeys,
  setUserPassword,
} from 'lib/SecureStorage';

/**
 * Hook that allows to store an account on the device.
 * This hook will perform all the operations to:
 * - save the wallet on the SecureStorage of the device
 * - save the account on the local storage of the device
 * - set the user password if the stored account is the first one
 * - perform the login
 *
 * <b>Note</b>
 * This hook only implements the logic of an account storing.
 */
const useStoreAccount = () => {
  const hasAccount = useHasAccount();
  const savingFirstAccount = useMemo(() => !hasAccount, [hasAccount]);
  const storeAccount = usePersistAccount();
  const setActiveAccountAddress = useSetActiveAccountAddress();

  return useCallback(
    async (account: AccountWithWallet, password: string): Promise<Result<void, Error>> => {
      // Save the wallet on the secure storage
      try {
        await saveWallet(account.wallet, password);
        if (savingFirstAccount) {
          // Set the active account address
          setActiveAccountAddress(account.wallet.address);
          // Set the user password
          await setUserPassword(password);
        }

        // Finally, store the account on the local storage
        storeAccount(account.account);
      } catch (error: any) {
        if (error) {
          await deleteWallet(account.wallet.address);
          if (savingFirstAccount) {
            await deleteItem(SecureStoreKeys.PASSWORD_CHALLENGE);
          }
        }
        return err(error);
      }

      return ok(undefined);
    },
    [savingFirstAccount, setActiveAccountAddress, storeAccount],
  );
};

export default useStoreAccount;
