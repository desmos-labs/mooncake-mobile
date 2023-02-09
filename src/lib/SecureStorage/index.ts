import * as Keychain from 'react-native-keychain';
import {
  getAllGenericPasswordServices,
  resetGenericPassword,
  Result as KeyChainResult,
} from 'react-native-keychain';
import { decryptData, encryptData, EncryptedData } from 'lib/EncryptionUtils';
import { SerializableWallet, Wallet } from 'types/wallet';
import { serializeWallet } from 'lib/WalletUtils/serialize';
import { deserializeWallet } from 'lib/WalletUtils/deserialize';
import { BiometricAuthorizations } from 'types/settings';
import { err, ok, Result, ResultAsync } from 'neverthrow';

export enum SecureStorageKeys {
  /**
   * Key used to store the user password encrypted with the
   * user biometrics.
   */
  BIOMETRIC_AUTHORIZATION_SUFFIX = '_BIOMETRIC_AUTHORIZATION',
  WALLET_SUFFIX = '_WALLET',
  PASSWORD_CHALLENGE = 'PASSWORD_CHALLENGE',
}

const passwordChallenge = 'butter-password-challenge';

const defaultOptions: Keychain.Options = {
  authenticationPrompt: {
    title: 'Biometric Authentication',
  },
  accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
};

/**
 * Options used to configure how the data will be stored into the device.
 */
export interface StoreOptions {
  /**
   * The password used to cipher the data.
   */
  password?: string;
  /**
   * Tells if the data should be linked to the user's biometric information.
   */
  biometrics?: boolean;
}

/**
 * Gets an item from the storage.
 * @param key Item key.
 * @param options Options to describe how the data are stored into the device storage.
 */
export async function getItem<T>(
  key: string,
  options: StoreOptions | undefined = undefined,
): Promise<Result<T | null, Error>> {
  const moreOptions = options?.biometrics === true ? { ...defaultOptions } : null;

  const data = await Keychain.getGenericPassword({
    service: key,
    ...moreOptions,
  });

  if (!data || options?.password === undefined) {
    return ok(null);
  }

  // Password provided, decrypt the data
  const jsonValueNew = JSON.parse(data.password);
  if (typeof jsonValueNew.iv !== 'string' && typeof jsonValueNew.cipher !== 'string') {
    return err(Error('Invalid encrypted data'));
  }

  const jsonSerialized = await ResultAsync.fromPromise(
    decryptData(jsonValueNew as EncryptedData, options.password),
    () => new Error('Invalid password'),
  );

  return jsonSerialized.map(JSON.parse);
}

/**
 * Inserts/Updates an item into the storage.
 * @param key Item key.
 * @param value Value to insert into the storage.
 * @param options Options to describe how the data will be stored into the device storage.
 */
export async function setItem<T>(
  key: string,
  value: T,
  options: StoreOptions | undefined = undefined,
): Promise<false | KeyChainResult> {
  const moreOptions = options?.biometrics === true ? { ...defaultOptions } : null;

  let data = JSON.stringify(value);

  // Password provided, encrypt the data.
  if (options?.password !== undefined) {
    const encryptedData = await encryptData(data, options.password);
    data = JSON.stringify(encryptedData);
  }

  return Keychain.setGenericPassword('butter', data, {
    service: key,
    ...moreOptions,
  });
}

export async function deleteItem(key: string): Promise<boolean> {
  return resetGenericPassword({ service: key });
}

export async function resetSecureStorage(): Promise<void> {
  const keys = await getAllGenericPasswordServices();
  await Promise.all(keys.map(async key => resetGenericPassword({ service: key })));
}

async function storeWallet(
  wallet: SerializableWallet,
  password: string,
): Promise<Result<void, Error>> {
  const result = await setItem(`${wallet.address}${SecureStorageKeys.WALLET_SUFFIX}`, wallet, {
    password,
  });

  if (!result) {
    return err(new Error(`Error while saving wallet ${wallet.address}`));
  }

  return ok(undefined);
}

/**
 * Saves a wallet into the device storage.
 * @param wallet - Wallet instance to save.
 * @param password - Password to protect the wallet.
 */
export const saveWallet = async (
  wallet: Wallet,
  password: string,
): Promise<Result<void, Error>> => {
  const serializableWallet = serializeWallet(wallet);
  return storeWallet(serializableWallet, password);
};

/**
 * Saves a wallet into the device storage.
 * @param address - Address of the wallet to delete.
 */
export const deleteWallet = async (address: string) =>
  deleteItem(`${address}${SecureStorageKeys.WALLET_SUFFIX}`);

/**
 * Gets a wallet from the device storage.
 * @param address - Address of the wallet to load.
 * @param password - Password used to protect the wallet.
 */
export const getWallet = async (
  address: string,
  password: string,
): Promise<Result<SerializableWallet, Error>> => {
  const loadedValue = await getItem<Partial<SerializableWallet>>(
    `${address}${SecureStorageKeys.WALLET_SUFFIX}`,
    {
      password,
    },
  );

  if (loadedValue.isErr()) {
    return err(loadedValue.error);
  }

  const serializedWallet = loadedValue.value;
  if (serializedWallet === null) {
    return err(new Error(`Can't find wallet for address: ${address}`));
  }
  return ok(deserializeWallet(serializedWallet));
};

/**
 * Sets the given password as the password that the user will use in order to
 * confirm transactions and unlock their wallet.
 * @param password {string} - Value of the password to be set.
 * @throws Error if for some reason the encryption operations fail.
 */
export const setUserPassword = async (password: string): Promise<Result<void, Error>> => {
  const result = await setItem<string>(SecureStorageKeys.PASSWORD_CHALLENGE, passwordChallenge, {
    password,
  });

  if (!result) {
    return err(new Error('error while storing the user password challenge'));
  }

  return ok(undefined);
};

/**
 * Checks whether the given password is the same that was set by the user in
 * order to unlock the wallet.
 * @param password {string} - Password to be checked.
 * @return {true} if the password matches the previous one, or {false} otherwise.
 * @throws Error if for some reason the decryption operations fail.
 */
export const checkUserPassword = async (password: string): Promise<Result<boolean, Error>> => {
  const value = await getItem<string>(SecureStorageKeys.PASSWORD_CHALLENGE, {
    password,
  });

  if (value.isErr()) {
    return err(value.error);
  }

  if (value.value === null) {
    return err(new Error("Can't validate user password"));
  }

  return ok(value.value === passwordChallenge);
};

/**
 * Allows to change the password that is used in order to encrypt the wallets of the user.
 * @param oldPassword {String} - Old password currently used to encrypt the wallet.
 * @param newPassword {String} - New password that will be used to encrypt the wallet.
 * @return `true` if all the operations are performed successfully, `false` otherwise.
 * If `false` is returned, it means the input password is incorrect.
 * @throws {Error} if for some reason the decryption of encryption fails.
 */
export const changeWalletsPassword = async (
  oldPassword: string,
  newPassword: string,
): Promise<Result<boolean, Error>> => {
  const isPasswordValid = await checkUserPassword(oldPassword);
  if (isPasswordValid.isErr()) {
    return ok(false);
  }

  // Get all the wallet addresses
  const services = await Keychain.getAllGenericPasswordServices();
  const walletAddresses = services
    .filter(key => key.endsWith(SecureStorageKeys.WALLET_SUFFIX))
    .map(key => key.replace(SecureStorageKeys.WALLET_SUFFIX, ''));

  // We need to disable the no-restricted-syntax and the no-await-in-loop lints
  // in the following lines so that this code is easier to read.
  // eslint-disable-next-line no-restricted-syntax
  for (const walletAddress of walletAddresses) {
    // Read the wallet with the current password
    // eslint-disable-next-line no-await-in-loop
    const walletResult = await getWallet(walletAddress, oldPassword);
    if (walletResult.isErr()) {
      return err(walletResult.error);
    }

    // Decrypt and re-encrypt the wallet with the new password
    // eslint-disable-next-line no-await-in-loop
    const storeResult = await storeWallet(walletResult.value, newPassword);
    if (storeResult.isErr()) {
      return err(storeResult.error);
    }
  }

  // Update the global password challenge
  const setPasswordResult = await setUserPassword(newPassword);
  if (setPasswordResult.isErr()) {
    return err(setPasswordResult.error);
  }

  // Get all the biometrics configurations to update
  const allKeys = await Keychain.getAllGenericPasswordServices();
  const biometricsKeys = Object.values(BiometricAuthorizations).map(
    auth => `${auth}${SecureStorageKeys.BIOMETRIC_AUTHORIZATION_SUFFIX}`,
  );
  const biometricsToUpdate = allKeys.filter(key => biometricsKeys.indexOf(key) !== -1);
  await Promise.all(biometricsToUpdate.map(key => setItem(key, newPassword, { biometrics: true })));

  return ok(true);
};

/**
 * Store the user password so that can be used to perform an operation
 * using the biometrics.
 * @param authorizationType - Type of biometric authorization.
 * @param password - The use password to store.
 */
export const storeBiometricAuthorization = async (
  authorizationType: BiometricAuthorizations,
  password: string,
) => {
  const isPasswordValid = await checkUserPassword(password);
  if (!isPasswordValid) {
    throw new Error('invalid user password');
  }

  await setItem(
    `${authorizationType}${SecureStorageKeys.BIOMETRIC_AUTHORIZATION_SUFFIX}`,
    password,
    {
      biometrics: true,
    },
  );
};

/**
 * Delete the password protected with biometric for the provided [BiometricAuthorizations].
 */
export const deleteBiometricAuthorization = async (
  authorizationType: BiometricAuthorizations,
): Promise<Result<boolean, Error>> => {
  const key = `${authorizationType}${SecureStorageKeys.BIOMETRIC_AUTHORIZATION_SUFFIX}`;

  // Get the item first to force the user to authenticate before delete.
  const item = await getItem(key, { biometrics: true });
  if (item.isErr()) {
    return err(item.error);
  }

  const result = await deleteItem(key);
  return ok(result);
};

/**
 * Gets the user password protected with the biometrics.
 * @param authorizationType - Biometric authorization type.
 */
export const getBiometricPassword = async (
  authorizationType: BiometricAuthorizations,
): Promise<Result<string | undefined, Error>> => {
  const password = await getItem<string>(
    `${authorizationType}${SecureStorageKeys.BIOMETRIC_AUTHORIZATION_SUFFIX}`,
    {
      biometrics: true,
    },
  );

  return password.map(value => value ?? undefined);
};
