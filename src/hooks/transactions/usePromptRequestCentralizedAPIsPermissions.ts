import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { useActiveAccountAddress } from '@recoil/accounts';
import useGetAuthorizationInformation from 'hooks/authorizations/useGetAuthorizationInformation';
import useButterConfig from 'hooks/config/useButterConfig';
import React from 'react';
import { EncodeObject } from '@cosmjs/proto-signing';
import { err, ok, Result } from 'neverthrow';
import { RequiredMessageTypesGrant } from 'config/AutzGrants';
import {
  buildGrantAllowanceEncodes,
  buildGrantMsgEncodes,
  getMissingAuthzPermissions,
  getMissingFeeGrantPermissions,
} from 'lib/AuthorizationsUtils';
import ROUTES from 'navigation/routes';
import { CanceledOperationError, CentralizedApiNotGrantedError } from 'types/error';

/**
 * Hook that provides a function that requests the user if they want to give
 * the fee grants and authz permissions to the centralized API so that can
 * perform the operations in a more simple way.
 */
const usePromptRequestCentralizedAPIsPermissions = () => {
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const activeAccountAddress = useActiveAccountAddress()!;
  const { refetch: fetchAuthorizations } = useGetAuthorizationInformation(
    activeAccountAddress,
    true,
  );
  const { config } = useButterConfig();

  return React.useCallback(
    async (_: EncodeObject[]) => {
      const fetchAuthorizationsResult = await fetchAuthorizations();
      if (fetchAuthorizationsResult.isErr()) {
        return err(fetchAuthorizationsResult.error);
      }

      return new Promise<Result<EncodeObject[], Error>>(resolve => {
        const { authzGrants, feeGrants } = fetchAuthorizationsResult.value;

        // Ideally, what could be done, is mapping each message to its type and ask the
        // permission only for such message. However, right now we ask for all permissions
        // for all messages here, in order to be coherent with that is done inside the
        // Settings page (where all permissions are enabled using a single toggle).
        const msgTypes = RequiredMessageTypesGrant;

        // Compute the missing permissions
        const missingFeeGrantsPermissions = getMissingFeeGrantPermissions(msgTypes, feeGrants);
        const missingAuthzPermissions = getMissingAuthzPermissions(msgTypes, authzGrants);

        if (missingFeeGrantsPermissions.length > 0 || missingAuthzPermissions.length > 0) {
          navigation.navigate(ROUTES.AUTHORIZATION_MODAL, {
            onPressYes: () => {
              const grantPermissionsMsgs: EncodeObject[] = [];
              if (missingFeeGrantsPermissions.length > 0) {
                grantPermissionsMsgs.push(
                  ...buildGrantAllowanceEncodes(
                    feeGrants,
                    missingFeeGrantsPermissions,
                    config?.desmosAddress ?? '',
                    activeAccountAddress,
                  ),
                );
              }
              if (missingAuthzPermissions.length > 0) {
                grantPermissionsMsgs.push(
                  ...buildGrantMsgEncodes(
                    missingFeeGrantsPermissions,
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
    [activeAccountAddress, config?.desmosAddress, fetchAuthorizations, navigation],
  );
};

export default usePromptRequestCentralizedAPIsPermissions;
