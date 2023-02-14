import React from 'react';
import useGetGrantsInformation from 'hooks/useGetGrantsInformation';
import { RequiredAuthzGrants } from 'config/AutzGrants';
import useBroadcastTx from 'hooks/useBroadcastTx';
import { EncodeObject } from '@cosmjs/proto-signing';
import { useAppStateValue } from '@recoil/appState';
import {
  buildGrantAllowanceEncode,
  buildGrantMsgEncodes,
  buildRevokeGrantMsgEncodes,
} from 'hooks/authGrants/useAddOrUpdateGrants/utils';
import { AuthorizationsInformation, Grant } from 'types/authorizations';
import { useActiveAccountAddress } from '@recoil/accounts';

/**
 * Computes the list of missing messages grant.
 * @param userGrants - List of user's grants.
 */
function getMissingGrants(userGrants: Grant[]): string[] {
  return RequiredAuthzGrants.filter(
    msgType => userGrants.find(grant => grant.msgTypeUrl === msgType) === undefined,
  );
}

/**
 * Hook that provide the grant information of the current active user.
 */
export const useUserApplicationGrants = () => {
  const activeAccountAddress = useActiveAccountAddress()!;
  const { info } = useGetGrantsInformation(activeAccountAddress);

  const haveAllPermissions = React.useMemo(() => {
    const missingPermissions = getMissingGrants(info.authz.grants);

    return info.feeGrant.hasFeeGrant && missingPermissions.length === 0;
  }, [info]);

  return {
    haveAllPermissions,
    authorizationInfo: info,
  };
};

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
    async (newState: boolean, currentAuthorizations: AuthorizationsInformation) => {
      const msgs: EncodeObject[] = [];
      if (newState) {
        const missingPermissions = getMissingGrants(currentAuthorizations.authz.grants);
        if (!currentAuthorizations.feeGrant.hasFeeGrant) {
          msgs.push(
            buildGrantAllowanceEncode(missingPermissions, apisAddress, activeAccountAddress),
          );
        }
        msgs.push(...buildGrantMsgEncodes(missingPermissions, apisAddress, activeAccountAddress));
      } else {
        msgs.push(
          ...buildRevokeGrantMsgEncodes(RequiredAuthzGrants, apisAddress, activeAccountAddress),
        );
      }

      // TODO: Investigate why with the centralized API this doesn't work.
      return broadcastTx(msgs, {
        onChain: newState,
      });
    },
    [activeAccountAddress, apisAddress, broadcastTx],
  );
};
