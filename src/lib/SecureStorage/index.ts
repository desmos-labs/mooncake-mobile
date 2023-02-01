import {
  decryptData,
  deriveSecurePassword,
  encryptData,
  EncryptedData,
} from 'lib/EncryptionUtils';

import LocalWallet from 'lib/LocalWallet';
import _ from 'lodash';
import {
  ACCESS_CONTROL,
  ACCESSIBLE,
  getAllGenericPasswordServices,
  getGenericPassword,
  Options,
  resetGenericPassword,
  Result,
  setGenericPassword,
} from 'react-native-keychain';
import {ChainAccount} from 'types/chains';

export const defaultSecureStorageOptions: Options = {
  authenticationPrompt: {
    title: 'Biometric Authentication',
  },
  accessible: ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  accessControl: ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
};

export enum SECURE_STORAGE_KEYS {
  WALLET_SUFFIX = '_KEY',
  MNEMONIC_SUFFIX = '_MNEMONIC',
  WALLET_PASSWORD_SUFFIX = '_WALLET_PASSWORD',
  ACCOUNTS = 'ACCOUNTS',
}

/**
 * Options used to configure how the data will be stored into the device.
 */
export interface StoreOptions {
  /**
   * The password used to cipher the data.
   */
  password?: string;
  /**
   * Tells if the data should be linked to the user's biometric informations.
   */
  biometrics?: boolean;
}

/**
 * Gets an item from the storage.
 * @param key An item key to identify the item stored.
 * @param options Options to describe how the data are stored into the device storage.
 */
async function getItem<T>(
  key: string,
  options?: StoreOptions | undefined,
): Promise<T | undefined> {
  const moreOptions =
    options?.biometrics === true ? {...defaultSecureStorageOptions} : null;
  const value = await getGenericPassword({
    service: key,
    ...moreOptions,
  });
  if (!value) {
    return undefined;
  }

  return JSON.parse(value.password);
}

/**
 * Inserts/Updates an item into the storage.
 * @param key An item key to identify the item stored.
 * @param value Value to insert into the storage.
 * @param options Options to describe how the data will be stored into the device storage.
 */
async function setItem(
  key: string,
  value: any,
  options?: StoreOptions | undefined,
): Promise<false | Result> {
  const moreOptions =
    options?.biometrics === true ? {...defaultSecureStorageOptions} : null;

  return setGenericPassword('secureValue', JSON.stringify(value), {
    service: key,
    ...moreOptions,
  });
}

export const deletePasswordWithBiometrics = async (address: string) => {
  // Delete the password saved with biometrics
  return deleteItem(`${address}${SECURE_STORAGE_KEYS.WALLET_PASSWORD_SUFFIX}`);
};

/**
 * Delete an item from the storage.
 * @param key The item key to delete.
 */
async function deleteItem(key: string): Promise<boolean> {
  return resetGenericPassword({service: key});
}

/**
 * Delete every item from the storage.
 */
export async function resetSecureStorage(): Promise<void> {
  const keys = await getAllGenericPasswordServices();
  await Promise.all(
    keys.map(async key => resetGenericPassword({service: key})),
  );
}

export const saveNewAccount = async (_account: ChainAccount) => {
  const oldAccounts = await getItem<ChainAccount[]>(
    SECURE_STORAGE_KEYS.ACCOUNTS,
  );

  if (oldAccounts) {
    const filteredAccounts = oldAccounts.filter(
      x => x.address !== _account.address,
    );
    const newAccounts = _.compact([...filteredAccounts, _account]);

    await setItem(SECURE_STORAGE_KEYS.ACCOUNTS, newAccounts);
  } else await setItem(SECURE_STORAGE_KEYS.ACCOUNTS, [_account]);
};

export const getAccounts = async (): Promise<ChainAccount[]> => {
  const accounts = await getItem<ChainAccount[]>(SECURE_STORAGE_KEYS.ACCOUNTS);
  return _.compact(accounts);
};

export const saveLocalWallet = async (
  _wallet: LocalWallet,
  password: string,
) => {
  const walletKey = `${_wallet.bech32Address}${SECURE_STORAGE_KEYS.WALLET_SUFFIX}`;

  const walletToSave = await encryptData(_wallet.serialize(), password);

  return setItem(walletKey, walletToSave);
};

export const getLocalWallet = async (
  address: string,
  password?: string,
  useBiometrics?: boolean,
): Promise<LocalWallet | undefined> => {
  let walletPassword = password;
  const walletKey = `${address}${SECURE_STORAGE_KEYS.WALLET_SUFFIX}`;

  if (!useBiometrics) {
    walletPassword = await deriveSecurePassword(walletPassword!);
  }

  const encryptedData = await getItem<EncryptedData>(walletKey);

  const decryptedData = await decryptData(encryptedData!, walletPassword!);

  return LocalWallet.deserialize(decryptedData);
};

/**
 * Save a wallet's mnemonic to secure storage
 * @param address The bech32 address of the wallet that the mnemonic belongs to
 * @param mnemonic The mnemonic to save
 * @param password The password to encrypt the data with
 */
export const saveMnemonic = async (
  address: string,
  mnemonic: string,
  password: string,
) => {
  const mnemonicKey = `${address}${SECURE_STORAGE_KEYS.MNEMONIC_SUFFIX}`;

  const encryptedMnemonic = await encryptData(mnemonic, password);

  return setItem(mnemonicKey, encryptedMnemonic, {password});
};

export const getMnemonic = async (
  address: string,
  password?: string,
  useBiometrics?: boolean,
): Promise<string | undefined> => {
  let _password = password;

  if (!useBiometrics) {
    _password = await deriveSecurePassword(password!);
  }

  const encryptedData = await getItem<EncryptedData>(
    `${address}${SECURE_STORAGE_KEYS.MNEMONIC_SUFFIX}`,
    {
      password: _password,
    },
  );

  return decryptData(encryptedData!, _password!);
};

export const deleteMnemonic = async (address: string) => {
  return deleteItem(`${address}${SECURE_STORAGE_KEYS.MNEMONIC_SUFFIX}`);
};

export const deleteLocalWallet = async (address: string) => {
  return Promise.all([
    deleteItem(`${address}${SECURE_STORAGE_KEYS.WALLET_SUFFIX}`),
    deleteItem(`${address}${SECURE_STORAGE_KEYS.WALLET_PASSWORD_SUFFIX}`),
    deleteMnemonic(address),
  ]);
};

// biometrics

/**
 * Save and encrypt a password to be used with biometrics auth
 * @param _wallet the wallet of the account
 * @param password the password of the account
 */
export const savePasswordWithBiometrics = async (
  _wallet: LocalWallet,
  password: string,
) => {
  // Store the derived password for biometric unlocking
  return setItem(
    `${_wallet.bech32Address}${SECURE_STORAGE_KEYS.WALLET_PASSWORD_SUFFIX}`,
    await deriveSecurePassword(password),
    {
      biometrics: true,
    },
  );
};

/**
 * Get an encrypted password from biometrics auth
 * @param address the address of the account
 */
export const getPasswordWithBiometrics = async (address: string) => {
  // Get the password to be derived
  return (await getItem<string>(
    `${address}${SECURE_STORAGE_KEYS.WALLET_PASSWORD_SUFFIX}`,
    {
      biometrics: true,
    },
  )) as string;
};

/**
 * Set and enable biometrics for all stored profiles
 * @param {string} oldPassword - The password used to unlock the currently stored wallet data.
 * @param {string} newPassword - The new password used to encrypt the new biometric data. If enabling biometrics, this can be the
 *                               same as the oldPassword param.
 */
export const setBiometricData = async (
  oldPassword: string,
  newPassword: string,
) => {
  const accounts = await getAccounts();
  const cleanedAccounts = _.compact(accounts);
  const wallets = _.compact(
    await Promise.all(
      cleanedAccounts.map(async (account: {address: string}) => {
        return getLocalWallet(account.address, oldPassword);
      }),
    ),
  );

  return Promise.all(
    wallets.map(async wallet => {
      return savePasswordWithBiometrics(wallet!, newPassword);
    }),
  );
};

/**
 * Disable and remove all biometric data for all accounts.
 */
export const deleteBiometricData = async () => {
  const accounts = await getAccounts();
  return Promise.all(
    accounts.map(async acc => {
      return deletePasswordWithBiometrics(acc.address);
    }),
  );
};
