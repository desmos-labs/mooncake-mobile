import { PrivateKeySigner, SigningMode } from '@desmoslabs/desmjs';
import { WalletConnectSigner } from '@desmoslabs/desmjs-walletconnect-v2';
import { AccountWithWallet, WalletConnectAccount } from 'types/account';
import { WalletConnectWallet, WalletConnectWalletApp, WalletType } from 'types/wallet';

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

/**
 * Function allowing to generate a WalletConnectWallet.
 * @param walletApp - The application that has been used to import the wallet.
 * @param externalWalletSigner - The signer associated with the external wallet.
 * @param sessionTopic - The WalletConnect session topic that has been used to
 * interact with the external wallet.
 * @param tempWalletOptions - Options to create a temporary wallet that can be used
 * by the application to perform the operations on behalf of the user without leaving
 * the application.
 */
export const generateWalletConnectWallet = async (
  walletApp: WalletConnectWalletApp,
  externalWalletSigner: WalletConnectSigner,
  sessionTopic: string,
  tempWalletOptions?: {
    signer: PrivateKeySigner;
    authorizations: string[];
    authorizationsExpiration: Date;
  },
): Promise<AccountWithWallet> => {
  if (walletApp !== WalletConnectWalletApp.DPM) {
    throw new Error(`Unsupoprted walletApp ${walletApp}`);
  }

  const [externalWalletAccount] = await externalWalletSigner.getAccounts();
  let walletTempWallet: WalletConnectWallet['tempWallet'];
  let accountTempWallet: WalletConnectAccount['tempWallet'];
  if (tempWalletOptions) {
    // Build the tempWallet field for the wallet.
    await tempWalletOptions.signer.connect();
    const [tempWalletAccount] = await tempWalletOptions.signer.getAccounts();
    const tempWalletPrivateKey = tempWalletOptions.signer.privateKey;
    walletTempWallet = {
      privateKey: tempWalletPrivateKey.key,
      address: tempWalletAccount.address,
      authorizedMessages: tempWalletOptions.authorizations,
      authorizationExpiration: tempWalletOptions.authorizationsExpiration,
    };

    // Build the tempWallet field fro the account.
    accountTempWallet = {
      pubKey: tempWalletAccount.pubkey,
      address: tempWalletAccount.address,
      authorizationExpiration: tempWalletOptions.authorizationsExpiration,
      authorizedMessages: tempWalletOptions.authorizations,
    };
  }

  const wallet: WalletConnectWallet = {
    type: WalletType.WalletConnect,
    walletApp,
    address: externalWalletAccount.address,
    sessionTopic,
    addressPrefix: 'desmos',
    signer: externalWalletSigner,
    tempWallet: walletTempWallet,
  };

  const account: WalletConnectAccount = {
    walletType: WalletType.WalletConnect,
    walletApp,
    address: externalWalletAccount.address,
    sessionTopic,
    pubKey: externalWalletAccount.pubkey,
    algo: externalWalletAccount.algo,
    tempWallet: accountTempWallet,
    creationDate: new Date(),
  };

  return {
    account,
    wallet,
  };
};
