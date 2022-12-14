import LocalWallet from 'lib/LocalWallet';
import {
  deleteLocalWallet,
  deleteMnemonic,
  saveLocalWallet,
  saveMnemonic,
} from 'lib/SecureStorage';

/**
 * Deletes all saved data of the specified wallets from secure storage.
 * @param {LocalWallet[]} wallets - An array of LocalWallets delete.
 */
export const deleteOldWalletData = async (wallets: LocalWallet[]) => {
  // maybe we could just pass an array of addresses instead.
  const deleteLocalWalletPromises = wallets.map(wallet =>
    deleteLocalWallet(wallet!.bech32Address),
  );

  const deleteMnemonicPromises = wallets.map(wallet =>
    deleteMnemonic(wallet?.bech32Address!),
  );

  await Promise.all([...deleteLocalWalletPromises, ...deleteMnemonicPromises]);
};

/**
 * Save wallet data to secure storage
 * @param {LocalWallet[]} wallets - The wallets to save.
 * @param {string} mnemonic - The mnemonic of the wallets to save. Due to how the app is structured,
 *                            all wallets will have the save mnemonic.
 * @param {string} newPassword - The new password to encrypt the data with.
 */
export const saveNewWalletData = async (
  wallets: LocalWallet[],
  mnemonic: string,
  newPassword: string,
) => {
  const saveLocalWalletPromises = wallets.map(wallet =>
    saveLocalWallet(wallet, newPassword),
  );
  const saveMnemonicPromises = wallets.map(wallet =>
    saveMnemonic(wallet.bech32Address, mnemonic!, newPassword),
  );

  await Promise.all([...saveLocalWalletPromises, ...saveMnemonicPromises]);
};
