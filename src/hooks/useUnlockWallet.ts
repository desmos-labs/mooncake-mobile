import {LedgerSigner} from '@cosmjs/ledger-amino';
import {OfflineSigner} from '@cosmjs/proto-signing';
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {ComponentProps, useCallback} from 'react';
import {DesmosLedgerApp} from 'config/LedgerApps';
import {ChainAccount, ChainAccountType} from 'types/chains';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {toCosmjsHdPath} from 'lib/FormatUtils';
import LocalWallet from 'lib/LocalWallet';
import DView from 'components/DView';

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

/**
 * Hooks that provides a function to unlock and access the user wallet.
 */
export default function useUnlockWallet(): (
  /* A type of account that is being used. */
  chainAccount: ChainAccount,
  /* A boolean that is used to determine whether the current route should be replaced or not. */
  shouldReplaceRoute?: boolean,
  /* A prop that is passed to Enter Password Screen. */
  titleLabelOverride?: string,
  /* A prop that is passed to the Enter Password Screen. */
  buttonLabelOverride?: string,
  /* A prop that is passed to the DView component. */
  dViewProps?: ComponentProps<typeof DView>,
  /* A prop that is passed to the Enter Password Screen. */
  providePassword?: boolean,
) => Promise<
  {wallet?: OfflineSigner; mnemonic?: string; password?: string} | undefined
> {
  const navigation = useNavigation<NavProps['navigation']>();

  return useCallback(
    async (
      account,
      shouldReplaceRoute,
      titleLabelOverride,
      buttonLabelOverride,
      dViewProps,
      providePassword,
    ) => {
      const navigate = shouldReplaceRoute
        ? navigation.replace
        : navigation.navigate;
      if (account.type === ChainAccountType.Local) {
        return new Promise(resolve => {
          navigate(ROUTES.AUTHORIZE_WALLET, {
            screen: ROUTES.AUTH_UNLOCK_LOCAL_WALLET,
            params: {
              address: account.address,
              provideWallet: true,
              provideMnemonic: true,
              providePassword,
              titleLabelOverride,
              buttonLabelOverride,
              dViewProps,
              onSuccessfulAuthentication: (
                result: LocalAccountAuthenticationArgs,
              ) => {
                resolve({
                  wallet: result.wallet!,
                  mnemonic: result.mnemonic,
                  password: result.password,
                });
              },
            },
          });
        });
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
                  hdPaths: [toCosmjsHdPath(account.hdPath)],
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
