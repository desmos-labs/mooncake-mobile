import LocalWallet from 'lib/LocalWallet';
import {
  deleteLocalWallet,
  deleteMnemonic,
  deletePasswordWithBiometrics,
  saveLocalWallet,
  saveMnemonic,
  savePasswordWithBiometrics,
} from 'lib/SecureStorage';
import {ChainAccount} from 'types/chains';

export const deleteOldWalletData = async (wallets: LocalWallet[]) => {
  const deleteLocalWalletPromises = wallets.map(wallet =>
    deleteLocalWallet(wallet!.bech32Address),
  );

  const deleteMnemonicPromises = wallets.map(wallet =>
    deleteMnemonic(wallet?.bech32Address!),
  );

  await Promise.all([...deleteLocalWalletPromises, ...deleteMnemonicPromises]);
};

export const replaceBiometricsData = async (
  accounts: ChainAccount[],
  wallets: LocalWallet[],
  newPassword: string,
) => {
  const deletePasswordMap = accounts.map(async acc => {
    return deletePasswordWithBiometrics(acc.address);
  });

  const savePasswordMap = wallets.map(async wallet => {
    return savePasswordWithBiometrics(wallet!, newPassword);
  });

  await Promise.all([...deletePasswordMap, ...savePasswordMap]);
};

export const saveNewWalletData = async (
  wallets: LocalWallet[],
  mnemonic: string,
  newPassword: string,
) => {
  const saveLocalWalletPromises = wallets.map(wallet =>
    saveLocalWallet(wallet!, newPassword),
  );
  const saveMnemonicPromises = wallets.map(wallet =>
    saveMnemonic(wallet?.bech32Address!, mnemonic!, newPassword),
  );

  await Promise.all([...saveLocalWalletPromises, ...saveMnemonicPromises]);
};
