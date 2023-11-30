import { useCallback } from 'react';
import { err, ok, Result } from 'neverthrow';
import { useStoreAccount as usePersistAccount } from '@recoil/accounts';
import { AccountWithWallet } from 'types/account';
import { saveWallet, setUserPassword } from 'lib/SecureStorage';

/**
 * Hook that allows to update a stored account on the device.
 * This hook will perform all the operations to:
 * - save the wallet on the SecureStorage of the device
 * - save the account on the local storage of the device
 * - set the user password if the stored account is the first one
 */
const useUpdateAccount = () => {
  const storeAccount = usePersistAccount();

  return useCallback(
    async (account: AccountWithWallet, password: string): Promise<Result<void, Error>> => {
      // Save the wallet on the secure storage
      try {
        await saveWallet(account.wallet, password);
        await setUserPassword(password);

        // Finally, store the account on the local storage
        storeAccount(account.account);
      } catch (error: any) {
        return err(error);
      }

      return ok(undefined);
    },
    [storeAccount],
  );
};

export default useUpdateAccount;
