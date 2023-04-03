import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { useActiveAccountAddress } from '@recoil/accounts';
import useButterConfig from 'hooks/config/useButterConfig';
import React from 'react';
import { EncodeObject } from '@cosmjs/proto-signing';
import { err, ok, Result } from 'neverthrow';
import { RequiredMessageTypesGrant } from 'config/AutzGrants';
import { buildGrantAllowanceEncodes, buildGrantMsgEncodes } from 'lib/AuthorizationsUtils';
import ROUTES from 'navigation/routes';
import { CanceledOperationError, CentralizedApiNotGrantedError } from 'types/error';
import useRefreshAuthorizations from 'hooks/authorizations/useRefreshAuthorizations';
import { useAppStateValue } from '@recoil/appState';

/**
 * Hook that provides a function that requests the user if they want to give
 * the fee grants and authz permissions to the centralized API so that can
 * perform the operations in a more simple way.
 */
const usePromptRequestCentralizedAPIsPermissions = () => {
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();

  const activeAccountAddress = useActiveAccountAddress();
  const subspaceId = useAppStateValue('subspaceId');
  const { config } = useButterConfig();

  const { refresh: refreshAuthorizations } = useRefreshAuthorizations();

  return React.useCallback(
    async (_: EncodeObject[]) => {
      if (!activeAccountAddress) {
        throw new Error('Cannot prompt for permissions without an active account');
      }

      // Ideally, what should be done here is mapping each message to its type and ask the
      // permission only for such message. However, right now we ask for all permissions
      // for all messages here, in order to be coherent with that is done inside the
      // Settings page (where all permissions are enabled using a single toggle).
      const { currentFeeGrants, missingFeeGrants, missingAuthzGrants } =
        await refreshAuthorizations(activeAccountAddress, RequiredMessageTypesGrant);

      return new Promise<Result<EncodeObject[], Error>>(resolve => {
        if (missingFeeGrants.length > 0 || missingAuthzGrants.length > 0) {
          navigation.navigate(ROUTES.AUTHORIZATION_MODAL, {
            onPressYes: () => {
              const grantPermissionsMsgs: EncodeObject[] = [];
              if (missingFeeGrants.length > 0) {
                grantPermissionsMsgs.push(
                  ...buildGrantAllowanceEncodes(
                    currentFeeGrants,
                    missingFeeGrants,
                    config?.desmosAddress ?? '',
                    activeAccountAddress,
                  ),
                );
              }
              if (missingAuthzGrants.length > 0) {
                grantPermissionsMsgs.push(
                  ...buildGrantMsgEncodes(
                    subspaceId,
                    missingAuthzGrants,
                    config?.desmosAddress ?? '',
                    activeAccountAddress,
                  ),
                );
              }
              resolve(ok(grantPermissionsMsgs));
            },
            onPressNo: () => {
              resolve(err(new CentralizedApiNotGrantedError()));
            },
            onDismiss: () => {
              resolve(err(new CanceledOperationError()));
            },
          });
        } else {
          resolve(ok([]));
        }
      });
    },
    [activeAccountAddress, config?.desmosAddress, navigation, refreshAuthorizations, subspaceId],
  );
};

export default usePromptRequestCentralizedAPIsPermissions;
