import {
  decryptData,
  deriveSecurePassword,
  encryptData,
} from 'lib/EncryptionUtils';
import {
  defaultSecureStorageOptions,
  deleteBiometricData,
  deleteLocalWallet,
  deleteMnemonic,
  deletePasswordWithBiometrics,
  getAccounts,
  getLocalWallet,
  getMnemonic,
  getPasswordWithBiometrics,
  resetSecureStorage,
  saveLocalWallet,
  saveMnemonic,
  saveNewAccount,
  savePasswordWithBiometrics,
  SECURE_STORAGE_KEYS,
  setBiometricData,
} from 'lib/SecureStorage';
import {
  getAllGenericPasswordServices,
  getGenericPassword,
  resetGenericPassword,
  setGenericPassword,
} from 'react-native-keychain';
import {ChainAccount, ChainAccountType} from 'types/chains';
import LocalWallet from 'lib/LocalWallet';

jest.mock('lib/EncryptionUtils', () => ({
  deriveSecurePassword: jest.fn(),
  encryptData: jest.fn(),
  decryptData: jest.fn(),
}));

describe('lib/SecureStorage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('resetSecureStorage', () => {
    it('resets all keychain values', async () => {
      (getAllGenericPasswordServices as jest.Mock).mockResolvedValue([
        'mockService1',
        'mockService2',
      ]);

      await resetSecureStorage();
      expect(resetGenericPassword).toHaveBeenCalledWith({
        service: 'mockService1',
      });
      expect(resetGenericPassword).toHaveBeenCalledWith({
        service: 'mockService2',
      });
    });
  });

  describe('saveNewAccount', () => {
    it('saves a new account', async () => {
      (getGenericPassword as jest.Mock).mockResolvedValue(undefined);

      const mockAccountData: ChainAccount = {
        type: ChainAccountType.Local,
        address: 'mockAddress',
        hdPath: {
          coinType: 0,
          account: 0,
          change: 0,
          addressIndex: 0,
        },
        pubKey: 'mockPubkey',
        signAlgorithm: 'secp256k1',
      };

      await saveNewAccount(mockAccountData);

      expect(setGenericPassword).toHaveBeenCalledWith(
        'secureValue',
        JSON.stringify([mockAccountData]),
        {
          service: 'ACCOUNTS',
        },
      );
    });

    it('saves appends new accounts to existing accounts list', async () => {
      (getGenericPassword as jest.Mock).mockResolvedValue({password: '[{}]'});

      const mockAccountData: ChainAccount = {
        type: ChainAccountType.Local,
        address: 'mockAddress',
        hdPath: {
          coinType: 0,
          account: 0,
          change: 0,
          addressIndex: 0,
        },
        pubKey: 'mockPubkey',
        signAlgorithm: 'secp256k1',
      };

      await saveNewAccount(mockAccountData);

      expect(setGenericPassword).toHaveBeenCalledWith(
        'secureValue',
        JSON.stringify([{}, mockAccountData]),
        {
          service: 'ACCOUNTS',
        },
      );
    });
  });

  describe('getAccounts', () => {
    it('retrieves all accounts stored in keychain', async () => {
      await getAccounts();

      expect(getGenericPassword).toHaveBeenCalledWith({service: 'ACCOUNTS'});
    });
  });
  describe('saveLocalWallet', () => {
    it('saves a new wallet if no existing wallets are found', async () => {
      (deriveSecurePassword as jest.Mock).mockReturnValue(
        'mockDerivedSecurePassword',
      );

      (encryptData as jest.Mock).mockReturnValue({
        value: 'mockEncrypteddWalletData',
      });
      const wallet: any = {
        bech32Address: 'mockWalletAddress',
        serialize: () => 'serializedWallet',
      };

      await saveLocalWallet(wallet, '123');

      // expect a derived secure password from the user's entered password
      // expect(deriveSecurePassword).toHaveBeenCalledWith('123');

      // expect the derived password to have been saved
      expect(setGenericPassword).toHaveBeenCalledWith(
        'secureValue',
        '{"value":"mockEncrypteddWalletData"}',
        {
          service: 'mockWalletAddress_KEY',
        },
      );

      expect(setGenericPassword).toHaveBeenCalledWith(
        'secureValue',
        '{"value":"mockEncrypteddWalletData"}',
        {
          service: 'mockWalletAddress_KEY',
        },
      );
    });
  });

  // TODO: write test for retrieving with biometrics
  describe('getLocalWallet', () => {
    it('returns deserialized localWallet by key', async () => {
      (getGenericPassword as jest.Mock).mockResolvedValue({password: '[]'});
      (decryptData as jest.Mock).mockReturnValue(
        JSON.stringify({
          version: 3,
          privateKey: 'BvgXa2OYRQyhWcfRVhnA8OZ1fLERoaFs+ZzmUlDMsKY=',
          publicKey: 'AyjdXn3Ddz1xXE85rNichgHvEYBg9O4scWQLeEq7z2BA',
          prefix: 'desmos',
        }),
      );

      const deserializeSpy = jest.spyOn(LocalWallet, 'deserialize');

      await getLocalWallet('mockAddress', '123');

      // expect a derived secure password from the user's entered password
      expect(deriveSecurePassword).toHaveBeenCalledWith('123');

      // expect the wallet data to be deserialized
      expect(deserializeSpy).toHaveBeenCalledWith(
        '{"version":3,"privateKey":"BvgXa2OYRQyhWcfRVhnA8OZ1fLERoaFs+ZzmUlDMsKY=","publicKey":"AyjdXn3Ddz1xXE85rNichgHvEYBg9O4scWQLeEq7z2BA","prefix":"desmos"}',
      );
    });
  });

  describe('saveMnemonic', () => {
    it('saves a mnemonic to secure storage', async () => {
      (encryptData as jest.Mock).mockReturnValue('mockEncryptedMnemonic');

      await saveMnemonic('mockAddress', 'mockMnemonic', 'mockPassword');

      expect(setGenericPassword).toHaveBeenCalledWith(
        'secureValue',
        '"mockEncryptedMnemonic"',
        {service: 'mockAddress_MNEMONIC'},
      );
    });
  });

  // TODO: write tests for biometrics
  describe('getMnemonic', () => {
    it('retrieves a stored mnemonic from secure storage', async () => {
      (deriveSecurePassword as jest.Mock).mockReturnValue(
        'mockDerivedSecurePassword',
      );

      (getGenericPassword as jest.Mock).mockResolvedValue({
        password: JSON.stringify({value: 'mockStoredMnemonic'}),
      });

      await getMnemonic('mockAddress', 'mockPassword');

      expect(deriveSecurePassword).toHaveBeenCalledWith('mockPassword');

      expect(decryptData).toHaveBeenCalledWith(
        {value: 'mockStoredMnemonic'},
        'mockDerivedSecurePassword',
      );
    });
  });

  describe('deleteMnemonic', () => {
    it('deletes a mnemonic from secure storage', async () => {
      await deleteMnemonic('mockAddress');

      expect(resetGenericPassword).toHaveBeenCalledWith({
        service: 'mockAddress_MNEMONIC',
      });
    });
  });

  describe('deleteLocalWallet', () => {
    it('deletes a local wallet, associated password, and mnemonic from local storage', async () => {
      await deleteLocalWallet('mockAddress');

      expect(resetGenericPassword).toHaveBeenCalledWith({
        service: 'mockAddress_KEY',
      });

      expect(resetGenericPassword).toHaveBeenCalledWith({
        service: 'mockAddress_WALLET_PASSWORD',
      });

      expect(resetGenericPassword).toHaveBeenCalledWith({
        service: 'mockAddress_MNEMONIC',
      });
    });
  });

  describe('deletePasswordWithBiometrics', () => {
    it('deletes the password associated with the specified address', async () => {
      const mockAddress = 'i-am-an-address';
      await deletePasswordWithBiometrics(mockAddress);
      expect(resetGenericPassword).toHaveBeenCalledWith({
        service: `${mockAddress}${SECURE_STORAGE_KEYS.WALLET_PASSWORD_SUFFIX}`,
      });
    });
  });

  describe('savePasswordWithBiometrics', () => {
    it('derives a secure password and saves it in secure storage', async () => {
      const mockArgs = {
        _wallet: {
          bech32Address: 'i-am-an-address',
        },
        password: 'i-am-a-password',
      };

      await savePasswordWithBiometrics(
        mockArgs._wallet as any,
        mockArgs.password,
      );

      expect(setGenericPassword).toHaveBeenCalledWith(
        'secureValue',
        '"mockDerivedSecurePassword"',
        {
          accessControl: 'PASSCODE',
          accessible: 0,
          authenticationPrompt: {title: 'Biometric Authentication'},
          service: 'i-am-an-address_WALLET_PASSWORD',
        },
      );
    });
  });

  describe('getPasswordWithBiometrics', () => {
    it('retrieves the password associated with the given address', async () => {
      const mockAddress = 'i-am-an-address';

      await getPasswordWithBiometrics(mockAddress);

      expect(getGenericPassword).toHaveBeenCalledWith({
        service: `${mockAddress}${SECURE_STORAGE_KEYS.WALLET_PASSWORD_SUFFIX}`,
        ...defaultSecureStorageOptions,
      });
    });
  });

  describe('setBiometricData', () => {
    it('sets a new biometric password for all saved accounts', async () => {
      const mockAccount: ChainAccount = {
        type: ChainAccountType.Local,
        address: 'i-am-an-address',
        hdPath: {} as any,
        pubKey: 'i-am-a-pubKey',
        signAlgorithm: 'secp256k1',
      };
      const mockExistingAccounts = [mockAccount];

      const mockEncryptedAccountData = {
        cipher: 'i-am-a-cipher',
        iv: 'i-am-a-iv',
      };

      const mockOldPassword = 'password123';
      const mockNewPassword = 'newBetterPassword!@#!@#!@#@!';

      (getGenericPassword as jest.Mock)
        .mockResolvedValueOnce({
          password: JSON.stringify(mockExistingAccounts),
        })
        .mockResolvedValueOnce({
          password: JSON.stringify(mockEncryptedAccountData),
        });

      // resolves to a dummy account, does not exist on testnet
      (decryptData as jest.Mock).mockResolvedValueOnce(
        JSON.stringify({
          version: 3,
          privateKey: 'MSMDf8XfmUuihLd0JNcHeZRKVDjMBC9Npiq5Sosuge8=',
          publicKey: 'A/QWvoXZiY0HnndebPYwPyMkhFr5K0c+3Q3sO2Sp0Gyc',
          prefix: 'desmos',
        }),
      );

      await setBiometricData(mockOldPassword, mockNewPassword);

      expect(setGenericPassword).toHaveBeenCalledWith(
        'secureValue',
        '"mockDerivedSecurePassword"',
        {
          service:
            'desmos13uxapntgsrv7u3nel9zc2jrg2gdjqwpv345xwy_WALLET_PASSWORD',
          ...defaultSecureStorageOptions,
        },
      );
      expect(deriveSecurePassword).toHaveBeenCalledWith(mockNewPassword);
    });
  });

  describe('deleteBiometricData', () => {
    it('deletes the secure password associated with the given address', async () => {
      const mockAccount: ChainAccount = {
        type: ChainAccountType.Local,
        address: 'i-am-an-address',
        hdPath: {} as any,
        pubKey: 'i-am-a-pubKey',
        signAlgorithm: 'secp256k1',
      };

      const mockAccount2: ChainAccount = {
        type: ChainAccountType.Local,
        address: 'i-am-another-address',
        hdPath: {} as any,
        pubKey: 'i-am-a-pubKey',
        signAlgorithm: 'secp256k1',
      };

      const mockExistingAccounts = [mockAccount, mockAccount2];

      (getGenericPassword as jest.Mock).mockResolvedValueOnce({
        password: JSON.stringify(mockExistingAccounts),
      });

      await deleteBiometricData();

      expect(resetGenericPassword).toHaveBeenNthCalledWith(1, {
        service: `${mockAccount.address}${SECURE_STORAGE_KEYS.WALLET_PASSWORD_SUFFIX}`,
      });

      expect(resetGenericPassword).toHaveBeenNthCalledWith(2, {
        service: `${mockAccount2.address}${SECURE_STORAGE_KEYS.WALLET_PASSWORD_SUFFIX}`,
      });
    });
  });
});
