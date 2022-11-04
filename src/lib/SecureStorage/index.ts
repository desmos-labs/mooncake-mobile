import {
  ACCESS_CONTROL,
  ACCESSIBLE,
  getAllGenericPasswordServices,
  resetGenericPassword,
  Result,
  getGenericPassword,
  setGenericPassword,
  Options,
} from 'react-native-keychain';
import _ from 'lodash';

import LocalWallet from 'lib/LocalWallet';
import {ChainAccount} from 'types/chains';
import {
  decryptData,
  deriveSecurePassword,
  encryptData,
} from 'lib/EncryptionUtils';

const defaultOptions: Options = {
  authenticationPrompt: {
    title: 'Biometric Authentication',
  },
  accessible: ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  accessControl: ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
};

enum SECURE_STORAGE_KEYS {
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
  const moreOptions = options?.biometrics === true ? {...defaultOptions} : null;
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
  const moreOptions = options?.biometrics === true ? {...defaultOptions} : null;

  return setGenericPassword('secureValue', JSON.stringify(value), {
    service: key,
    ...moreOptions,
  });
}

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

export const getAccounts = async () =>
  getItem<ChainAccount[]>(SECURE_STORAGE_KEYS.ACCOUNTS);

export const turnOnBiometrics = async (
  _wallet: LocalWallet,
  password: string,
) => {
  // Store the derived password for biometric unlocking
  return setItem(
    `${_wallet.bech32Address}${SECURE_STORAGE_KEYS.WALLET_PASSWORD_SUFFIX}`,
    deriveSecurePassword(password),
    {
      biometrics: true,
    },
  );
};

export const saveLocalWallet = async (
  _wallet: LocalWallet,
  password: string,
) => {
  const walletKey = `${_wallet.bech32Address}${SECURE_STORAGE_KEYS.WALLET_SUFFIX}`;

  const walletToSave = encryptData(_wallet.serialize(), password);

  return setItem(walletKey, walletToSave);
};

export const getLocalWallet = async (
  address: string,
  password?: string,
  useBiometrics?: boolean,
): Promise<LocalWallet | undefined> => {
  let walletPassword = password;
  const walletKey = `${address}${SECURE_STORAGE_KEYS.WALLET_SUFFIX}`;

  if (useBiometrics) {
    walletPassword = await getItem<string>(
      `${address}${SECURE_STORAGE_KEYS.WALLET_PASSWORD_SUFFIX}`,
      {
        biometrics: true,
      },
    );
  } else {
    walletPassword = deriveSecurePassword(walletPassword!);
  }

  const encryptedData = await getItem<string>(walletKey);

  const decryptedData = decryptData(encryptedData!, walletPassword!);

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

  const encryptedMnemonic = encryptData(mnemonic, password);

  return setItem(mnemonicKey, encryptedMnemonic, {password});
};

export const getMnemonic = async (
  address: string,
  password?: string,
  useBiometrics?: boolean,
): Promise<string | undefined> => {
  let _password: string;

  if (useBiometrics) {
    _password = (await getItem<string>(
      `${address}${SECURE_STORAGE_KEYS.WALLET_PASSWORD_SUFFIX}`,
      {
        biometrics: true,
      },
    )) as string;
  } else {
    _password = deriveSecurePassword(password!);
  }

  const encryptedData = await getItem<string>(
    `${address}${SECURE_STORAGE_KEYS.MNEMONIC_SUFFIX}`,
    {
      password: _password,
    },
  );

  return decryptData(encryptedData!, _password);
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
