import { PrivateKeySigner, SigningMode } from '@desmoslabs/desmjs';
import { AccountWithWallet } from 'types/account';
import { WalletGenerationData, WalletType } from 'types/wallet';

/**
 * Function allowing to generate a Web3AuthWallet.
 * @param prefix - Account prefix that should be used to generate the Bech32 address of the wallet.
 * @param loginProvider - Login provided used from the user to obtain the private key.
 * @param privateKey - The private key obtained from Web3Auth.
 */
export const generateWeb3AuthWallet = async (
  prefix: string,
  loginProvider: string,
  privateKey: Uint8Array,
): Promise<AccountWithWallet> => {
  const signer = PrivateKeySigner.fromSecp256k1(privateKey, SigningMode.DIRECT, {
    prefix,
  });

  await signer.connect();
  const [accountData] = await signer.getAccounts();

  return {
    wallet: {
      type: WalletType.Web3Auth,
      address: accountData.address,
      signer,
      loginProvider,
      privateKey,
      addressPrefix: prefix,
    },
    account: {
      walletType: WalletType.Web3Auth,
      address: accountData.address,
      pubKey: accountData.pubkey,
      algo: accountData.algo,
      loginProvider,
      creationDate: new Date(),
    },
  };
};

/**
 * Function allowing to generate a list of Wallet.
 * @param data - Wallet generation config.
 */
export const generateAccountWithWallets = async (
  data: WalletGenerationData,
): Promise<AccountWithWallet[]> => {
  switch (data.type) {
    case WalletType.Web3Auth: {
      const wallet = await generateWeb3AuthWallet(
        data.accountPrefix,
        data.loginProvider,
        data.privateKey,
      );
      return [wallet];
    }

    default:
      // @ts-ignore
      throw new Error(`Cannot generate wallet from HD path for import type ${data.type}`);
  }
};

/**
 * Function allowing to generate a PrivateKeyWallet.
 * @param prefix - Account prefix that should be used to generate the Bech32 address of the wallet.
 * @param privateKey - The wallet private key.
 */
export const generatePrivateKeyWallet = async (
  prefix: string,
  privateKey: Uint8Array,
): Promise<AccountWithWallet> => {
  const signer = PrivateKeySigner.fromSecp256k1(privateKey, SigningMode.DIRECT, {
    prefix,
  });

  await signer.connect();
  const [accountData] = await signer.getAccounts();

  return {
    wallet: {
      type: WalletType.PrivateKey,
      address: accountData.address,
      signer,
      privateKey,
      addressPrefix: prefix,
    },
    account: {
      walletType: WalletType.PrivateKey,
      address: accountData.address,
      pubKey: accountData.pubkey,
      algo: accountData.algo,
      creationDate: new Date(),
    },
  };
};
