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

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.AUTHORIZE_WALLET
>;

export type LocalAccountAuthenticationArgs = {
  authorized: boolean;

  wallet?: LocalWallet;

  mnemonic?: string;
};

/**
 * Hooks that provides a function to unlock and access the user wallet.
 */
export default function useUnlockWallet(): (
  account: ChainAccount,
) => Promise<{wallet?: OfflineSigner; mnemonic?: string} | undefined> {
  const navigation = useNavigation<NavProps['navigation']>();

  return useCallback(async (account: ChainAccount) => {
    if (account.type === ChainAccountType.Local) {
      return new Promise(resolve => {
        navigation.navigate(ROUTES.AUTHORIZE_WALLET, {
          screen: ROUTES.AUTH_UNLOCK_LOCAL_WALLET,
          params: {
            address: account.address,
            provideWallet: true,
            provideMnemonic: true,
            onSuccessfulAuthentication: (
              result: LocalAccountAuthenticationArgs,
            ) => {
              resolve({
                wallet: result.wallet,
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
    return new Promise(resolve => {
      navigation.navigate(ROUTES.AUTHORIZE_WALLET, {
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
              }) as OfflineSigner,
            });
          },
          onCancel: () => {
            resolve(undefined);
          },
        },
      });
    });
  }, []);
}
