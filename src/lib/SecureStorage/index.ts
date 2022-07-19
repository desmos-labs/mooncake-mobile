import {
  getAllGenericPasswordServices,
  resetGenericPassword,
  Result,
} from 'react-native-keychain';
import * as Keychain from 'react-native-keychain';

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
   * Tells if the data should be linked to the user's biometric informations.
   */
  biometrics?: boolean;
}

/**
 * Gets an item from the storage.
 * @param key An item key to identify the item stored.
 * @param options Options to describe how the data are stored into the device storage.
 */
export async function getItem(
  key: string,
  options: StoreOptions | undefined = undefined,
): Promise<string | null> {
  const moreOptions = options?.biometrics === true ? {...defaultOptions} : null;
  const value = await Keychain.getGenericPassword({
    service: key,
    ...moreOptions,
  });
  if (!value) {
    return null;
  }
  return JSON.parse(value.password);
}

/**
 * Inserts/Updates an item into the storage.
 * @param key An item key to identify the item stored.
 * @param value Value to insert into the storage.
 * @param options Options to describe how the data will be stored into the device storage.
 */
export async function setItem(
  key: string,
  value: string,
  options: StoreOptions | undefined = undefined,
): Promise<false | Result> {
  const moreOptions = options?.biometrics === true ? {...defaultOptions} : null;
  return Keychain.setGenericPassword('secureValue', JSON.stringify(value), {
    service: key,
    ...moreOptions,
  });
}

/**
 * Delete an item from the storage.
 * @param key The item key to delete.
 */
export async function deleteItem(key: string): Promise<boolean> {
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
