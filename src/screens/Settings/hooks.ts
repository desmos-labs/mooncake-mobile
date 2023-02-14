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

export const useUserApplicationGrants = (accountAddress: string) => {
  const { info } = useGetGrantsInformation(accountAddress);

  const haveAllPermissions = React.useMemo(() => {
    const missingPermissions = RequiredAuthzGrants.filter(
      msgType => info.authz.grants.find(grant => grant.msgTypeUrl === msgType) === undefined,
    );

    return info.feeGrant.hasFeeGrant && missingPermissions.length === 0;
  }, [info]);

  return {
    haveAllPermissions,
  };
};

export const useSetUserApplicationGrants = (accountAddress: string) => {
  const butterConfig = useAppStateValue('butterConfig');
  const apisAddress = butterConfig!.desmosAddress;
  const broadcastTx = useBroadcastTx();

  return React.useCallback(
    async (newState: boolean) => {
      const msgs: EncodeObject[] = [];
      if (newState) {
        msgs.push(
          buildGrantAllowanceEncode(RequiredAuthzGrants, apisAddress, accountAddress),
          ...buildGrantMsgEncodes(RequiredAuthzGrants, apisAddress, accountAddress),
        );
      } else {
        msgs.push(...buildRevokeGrantMsgEncodes(RequiredAuthzGrants, apisAddress, accountAddress));
      }

      return broadcastTx(msgs, {
        onChain: newState,
      });
    },
    [accountAddress, apisAddress, broadcastTx],
  );
};
