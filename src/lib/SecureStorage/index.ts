import * as SecureStore from 'expo-secure-store';
import { decryptData, encryptData, EncryptedData } from 'lib/EncryptionUtils';
import {
  CorruptedDataError,
  InvalidPasswordError,
  SecureStorageError,
  UnknownError,
  WalletNotFoundError,
  WrongPasswordError,
} from 'lib/SecureStorage/errors';
import { deserializeWallet } from 'lib/WalletUtils/deserialize';
import { serializeWallet } from 'lib/WalletUtils/serialize';
import { err, ok, Result, ResultAsync } from 'neverthrow';
import { SerializableWallet, Wallet } from 'types/wallet';

const passwordChallenge = 'butter-password-challenge';

export enum SecureStoreKeys {
  /**
   * Key used to store the user password encrypted with the
   * user biometrics.
   */
  BIOMETRIC_AUTHORIZATION_SUFFIX = '_BIOMETRIC_AUTHORIZATION',
  WALLET_SUFFIX = '_WALLET',
  PASSWORD_CHALLENGE = 'PASSWORD_CHALLENGE',
}

const defaultOptions: SecureStore.SecureStoreOptions = {
  authenticationPrompt: 'Biometric Authentication',
  requireAuthentication: true,
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
): Promise<Result<T | undefined, SecureStorageError>> {
  const moreOptions = options?.biometrics === true ? { ...defaultOptions } : undefined;

  const getDataResult = await ResultAsync.fromPromise(
    SecureStore.getItemAsync(key, moreOptions),
    // Safe to ignore this promise will raise an Error, and in such case
    // we just wrap the error in our custom error type.
    // @ts-ignore
    e => new UnknownError(e?.message ?? 'Error while loading the data from Keychain'),
  );

  if (getDataResult.isErr()) {
    return err(getDataResult.error);
  }

  const data = getDataResult.value;
  if (!data) {
    return ok(undefined);
  }

  // By default, if the password is not provided, the data is stored as a plain text
  let serializedData = data;

  // Password provided, decrypt the data
  if (options?.password !== undefined) {
    // Get the password to be used to decrypt the data
    const jsonValueNew = JSON.parse(data);
    if (typeof jsonValueNew.iv !== 'string' && typeof jsonValueNew.cipher !== 'string') {
      return err(new CorruptedDataError());
    }

    // Decrypt the data
    const result = await decryptData(jsonValueNew as EncryptedData, options.password);
    if (result.isErr()) {
      if (result.error.message.indexOf('BAD_DECRYPT') !== 0) {
        return err(new WrongPasswordError());
      }
      return err(new UnknownError(result.error.message));
    }
    serializedData = result.value;
  }

  // Deserialize the data
  return ok(JSON.parse(serializedData));
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
): Promise<void> {
  const moreOptions = options?.biometrics === true ? { ...defaultOptions } : undefined;

  let data = JSON.stringify(value);

  // Password provided, encrypt the data.
  if (options?.password !== undefined) {
    const encryptedData = await encryptData(data, options.password);
    data = JSON.stringify(encryptedData);
  }

  return SecureStore.setItemAsync(key, data, moreOptions);
}

export async function deleteItem(key: string): Promise<void> {
  return SecureStore.deleteItemAsync(key);
}

async function storeWallet(wallet: SerializableWallet, password: string): Promise<void> {
  const key = getWalletKey(wallet.address);
  return setItem(key, wallet, {
    password,
  });
}

/**
 * Saves a wallet into the device storage.
 * @param wallet - Wallet instance to save.
 * @param password - Password to protect the wallet.
 */
export const saveWallet = async (wallet: Wallet, password: string): Promise<void> => {
  const serializableWallet = serializeWallet(wallet);
  return storeWallet(serializableWallet, password);
};

const getWalletKey = (address: string) => `${address}${SecureStoreKeys.WALLET_SUFFIX}`;

/**
 * Saves a wallet into the device storage.
 * @param address - Address of the wallet to delete.
 */
export const deleteWallet = async (address: string) => {
  const key = getWalletKey(address);
  return deleteItem(key);
};

/**
 * Gets a wallet from the device storage.
 * @param address - Address of the wallet to load.
 * @param password - Password used to protect the wallet.
 */
export const getWallet = async (
  address: string,
  password: string,
): Promise<Result<SerializableWallet, SecureStorageError>> => {
  const key = getWalletKey(address);
  const result = await getItem<Partial<SerializableWallet>>(key, { password });
  if (result.isErr()) {
    return err(result.error);
  }

  // Read the value from the result
  const { value } = result;
  if (!value) {
    return err(new WalletNotFoundError(address));
  }

  // Return the deserialized wallet
  return ok(deserializeWallet(value));
};

/**
 * Sets the given password as the password that the user will use in order to
 * confirm tx and unlock their wallet.
 * @param password {string} - Value of the password to be set.
 * @throws Error if for some reason the encryption operations fail.
 */
export const setUserPassword = async (password: string): Promise<void> => {
  return setItem<string>(SecureStoreKeys.PASSWORD_CHALLENGE, passwordChallenge, {
    password,
  });
};

/**
 * Checks whether the given password is the same that was set by the user in
 * order to unlock the wallet.
 * @param password {string} - Password to be checked.
 * @return {true} if the password matches the previous one, or {false} otherwise.
 * @throws Error if for some reason the decryption operations fail.
 */
export const checkUserPassword = async (
  password: string,
): Promise<Result<boolean, SecureStorageError>> => {
  const value = await getItem<string>(SecureStoreKeys.PASSWORD_CHALLENGE, {
    password,
  });

  if (value.isErr()) {
    return err(value.error);
  }

  if (value.value === null) {
    return err(new UnknownError("Can't validate user password"));
  }

  return ok(value.value === passwordChallenge);
};

export const storeBiometricAuthorization = async (
  password: string,
  validationPassword: boolean,
): Promise<Result<void, SecureStorageError>> => {
  if (validationPassword) {
    const isPasswordValid = await checkUserPassword(password);
    if (!isPasswordValid) {
      return err(new InvalidPasswordError());
    }
  }
  try {
    await setItem(`${SecureStoreKeys.BIOMETRIC_AUTHORIZATION_SUFFIX}`, password, {
      biometrics: true,
    });
  } catch (e: any) {
    return err(new UnknownError(e.message ?? 'Error while storing the biometric authorization'));
  }

  return ok(undefined);
};

const getBiometricAuthorizationKey = () => `${SecureStoreKeys.BIOMETRIC_AUTHORIZATION_SUFFIX}`;

/**
 * Get the password protected with biometric for the provided [BiometricAuthorizations].
 */
export const getBiometricPassword = async () => {
  const key = getBiometricAuthorizationKey();
  const result = await getItem<string>(key, { biometrics: true });
  return result.unwrapOr(undefined);
};

/**
 * Delete the password protected with biometric for the provided [BiometricAuthorizations].
 */
export const deleteBiometricAuthorization = async (): Promise<Result<void, SecureStorageError>> => {
  const key = getBiometricAuthorizationKey();

  // Get the item first to force the user to authenticate before delete.
  const result = await getItem(key, { biometrics: true });
  if (result.isErr()) {
    return err(result.error);
  }

  // Delete the item
  await deleteItem(key);
  return ok(undefined);
};
