import React, { useCallback } from 'react';
import { RequiredAuthzGrants } from 'config/AutzGrants';
import useBroadcastTx from 'hooks/useBroadcastTx';
import { EncodeObject } from '@cosmjs/proto-signing';
import { useAppStateValue } from '@recoil/appState';
import {
  buildGrantAllowanceEncode,
  buildGrantMsgEncodes,
  buildRevokeAllowanceEncode,
  buildRevokeGrantMsgEncodes,
} from 'hooks/authGrants/useAddOrUpdateGrants/utils';
import { AuthorizationsInformation } from 'types/authorizations';
import { useActiveAccountAddress } from '@recoil/accounts';
import { deleteBiometricAuthorization } from 'lib/SecureStorage';
import { BiometricAuthorizations } from 'types/settings';
import ROUTES from 'navigation/routes';
import { useSetSetting, useSetting } from '@recoil/settings';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { getSupportedBiometryType } from 'react-native-keychain';

/**
 * Hook that provides a function to give or remove to the current user the grants
 * necessary to execute operations on behalf of the user.
 */
export const useSetUserApplicationGrants = () => {
  const activeAccountAddress = useActiveAccountAddress()!;
  const butterConfig = useAppStateValue('butterConfig');
  const apisAddress = butterConfig!.desmosAddress;
  const broadcastTx = useBroadcastTx();

  return React.useCallback(
    async (newState: boolean, authInfo: AuthorizationsInformation) => {
      const msgs: EncodeObject[] = [];
      if (newState) {
        if (authInfo.missingFeeGrantPermissions.length > 0) {
          msgs.push(
            buildGrantAllowanceEncode(
              authInfo.missingFeeGrantPermissions,
              apisAddress,
              activeAccountAddress,
            ),
          );
        }
        if (authInfo.missingAuthzPermissions.length > 0) {
          msgs.push(
            ...buildGrantMsgEncodes(
              authInfo.missingAuthzPermissions,
              apisAddress,
              activeAccountAddress,
            ),
          );
        }
      } else {
        msgs.push(buildRevokeAllowanceEncode(apisAddress, activeAccountAddress));
        msgs.push(
          ...buildRevokeGrantMsgEncodes(RequiredAuthzGrants, apisAddress, activeAccountAddress),
        );
      }

      return broadcastTx(msgs, {
        onChain: true,
      });
    },
    [activeAccountAddress, apisAddress, broadcastTx],
  );
};

/**
 * Hook to enable/disable the biometrics authentication.
 */
export const useToggleBiometrics = () => {
  const biometricsSetting = useSetting('biometrics');
  const setBiometricsSetting = useSetSetting('biometrics');
  const navigator = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const [biometricsError, setBiometricsError] = React.useState<string>();
  const [biometricsSupported, setBiometricsSupported] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        const supported = await getSupportedBiometryType();
        if (supported) {
          setBiometricsSupported(true);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const toggleBiometrics = useCallback(async () => {
    setBiometricsError(undefined);
    if (biometricsSetting) {
      const result = await deleteBiometricAuthorization(BiometricAuthorizations.UnlockWallet);
      if (result.isOk()) {
        setBiometricsSetting(false);
      } else {
        console.error('disable biometrics failed', result.error.message);
        setBiometricsError(result.error.message);
      }
    } else {
      navigator.navigate(ROUTES.SETTINGS_ENABLE_BIOMETRICS);
    }
  }, [biometricsSetting, navigator, setBiometricsSetting]);

  return {
    biometricsSupported,
    biometricsEnabled: biometricsSetting,
    biometricsError,
    toggleBiometrics,
  };
};
