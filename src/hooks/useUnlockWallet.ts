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
};

/**
 * Hooks that provides a function to unlock and access the user wallet.
 */
export default function useUnlockWallet(): (
  account: ChainAccount,
) => Promise<OfflineSigner | null> {
  const navigation = useNavigation<NavProps['navigation']>();

  return useCallback(
    async (account: ChainAccount) => {
      if (account.type === ChainAccountType.Local) {
        return new Promise((resolve, reject) => {
          navigation.navigate(ROUTES.AUTHORIZE_WALLET, {
            screen: ROUTES.AUTH_UNLOCK_LOCAL_WALLET,
            params: {
              address: account.address,
              provideWallet: true,
              onSuccessfulAuthentication: (
                result: LocalAccountAuthenticationArgs,
              ) => {
                resolve(result.wallet || null);
              },
              onFailedAuthentication: reject,
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
              resolve(
                new LedgerSigner(transport!, {
                  minLedgerAppVersion: DesmosLedgerApp!.minVersion,
                  ledgerAppName: DesmosLedgerApp!.name,
                  hdPaths: [toCosmjsHdPath(account.hdPath)],
                  prefix: 'desmos',
                }),
              );
            },
            onCancel: () => {
              resolve(null);
            },
          },
        });
      });
    },
    [navigation],
  );
}
