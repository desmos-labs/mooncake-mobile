import {LedgerSigner} from '@cosmjs/ledger-amino';
import {OfflineSigner} from '@cosmjs/proto-signing';
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {useCallback} from 'react';
import {DesmosLedgerApp} from 'config/LedgerApps';
import {ChainAccount, ChainAccountType} from 'types/chains';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {toCosmjsHdPath} from 'lib/FormatUtils';
import LocalWallet from 'lib/LocalWallet';
import {getLocalWallet, getMnemonic} from 'lib/SecureStorage';
import {getMMKV, MMKVKEYS} from 'lib/MMKVStorage';
import {EnterPasswordParams} from 'screens/EnterPassword';

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.AUTHORIZE_WALLET
>;

export type LocalAccountAuthenticationArgs = {
  authorized: boolean;

  wallet?: LocalWallet;

  mnemonic?: string;

  password?: string;
};

type useUnlockWalletParams = {
  chainAccount: ChainAccount;

  shouldReplaceRoute?: boolean;

  prefilledPassword?: string;

  enterPwScreenOptions?: Pick<
    EnterPasswordParams,
    'titleLabelOverride' | 'buttonLabelOverride' | 'dViewProps'
  >;
};

/**
 * Hooks that provides a function to unlock and access the user wallet.
 */
export default function useUnlockWallet(): (
  params: useUnlockWalletParams,
) => Promise<{wallet?: OfflineSigner; mnemonic?: string} | undefined> {
  const navigation = useNavigation<NavProps['navigation']>();

  const useBiometrics = getMMKV<boolean>(MMKVKEYS.USE_BIOMETRICS);

  return useCallback(
    async ({
      chainAccount,
      enterPwScreenOptions,
      prefilledPassword,
      shouldReplaceRoute,
    }: useUnlockWalletParams) => {
      const titleLabelOverride = enterPwScreenOptions?.titleLabelOverride;
      const buttonLabelOverride = enterPwScreenOptions?.buttonLabelOverride;
      const dViewProps = enterPwScreenOptions?.dViewProps;

      const navigate = shouldReplaceRoute
        ? navigation.replace
        : navigation.navigate;
      if (chainAccount.type === ChainAccountType.Local) {
        if (prefilledPassword) {
          const wallet = await getLocalWallet(
            chainAccount.address,
            prefilledPassword,
            useBiometrics,
          );

          if (!wallet) throw new Error('Error unlocking wallet');

          const mnemonic = await getMnemonic(
            chainAccount.address,
            prefilledPassword,
          );

          return new Promise(resolve => {
            resolve({
              wallet,
              mnemonic,
            });
          });
        } else {
          return new Promise(resolve => {
            navigate(ROUTES.AUTHORIZE_WALLET, {
              screen: ROUTES.AUTH_UNLOCK_LOCAL_WALLET,
              params: {
                address: chainAccount.address,
                provideWallet: true,
                provideMnemonic: true,
                titleLabelOverride,
                buttonLabelOverride,
                dViewProps,
                onSuccessfulAuthentication: (
                  result: LocalAccountAuthenticationArgs,
                ) => {
                  resolve({
                    wallet: result.wallet!,
                    mnemonic: result.mnemonic,
                  });
                },
                onFailedAuthentication: () => {
                  resolve(undefined);
                },
              },
            });
          });
        }
      }
      return new Promise(resolve => {
        navigate(ROUTES.AUTHORIZE_WALLET, {
          screen: ROUTES.AUTH_LOOKING_FOR_DEVICES,
          params: {
            ledgerApp: DesmosLedgerApp,
            autoClose: true,
            onConnectionEstablished: (transport: BluetoothTransport) => {
              resolve({
                wallet: new LedgerSigner(transport!, {
                  minLedgerAppVersion: DesmosLedgerApp!.minVersion,
                  ledgerAppName: DesmosLedgerApp!.name,
                  hdPaths: [toCosmjsHdPath(chainAccount.hdPath)],
                  prefix: 'desmos',
                }),
              });
            },
            onCancel: () => {
              resolve(undefined);
            },
          },
        });
      });
    },
    [],
  );
}
