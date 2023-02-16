import useGetAuthorizations from 'hooks/authorizations/useGetAuthorizationInformation';
import {
  buildGrantAllowanceEncode,
  buildRevokeAllowanceEncode,
  buildRevokeGrantMsgEncodes,
} from 'lib/AuthorizationsUtils';
import { EncodeObject } from '@cosmjs/proto-signing';
import { AllowedMsgAllowanceTypeUrl } from '@desmoslabs/desmjs';
import useButterConfig from 'hooks/useButterConfig';
import { err } from 'neverthrow';
import useBroadcastTx from 'hooks/useBroadcastTx';
import React from 'react';

const useRemoveAuthorizations = (accountAddress: string) => {
  const { refetch } = useGetAuthorizations(accountAddress);
  const { config: butterConfig } = useButterConfig();
  const broadcastTx = useBroadcastTx();

  return React.useCallback(
    async (authorizations: string[]) => {
      if (butterConfig?.desmosAddress === undefined) {
        return err(Error('Butter config is not set'));
      }

      // Fetch the current configurations.
      const { feeGrants } = await refetch();

      const msgs: EncodeObject[] = [];

      // The fee grant module don't support the update, we need to remove it
      // and then add it back with the difference from the current configured
      // fee grants minus the one that we want to remove.
      msgs.push(buildRevokeAllowanceEncode(butterConfig.desmosAddress, accountAddress));

      // Compute the difference between the current user's fee grants and the
      // ones we want to remove.
      const toKeepFeeGrant = feeGrants
        .flatMap(feeGrant => {
          if (feeGrant.allowance.typeUrl === AllowedMsgAllowanceTypeUrl) {
            return feeGrant.allowance.allowedMessages;
          } else {
            return [];
          }
        })
        .filter(feeGrantAllowedMessage => authorizations.indexOf(feeGrantAllowedMessage) === -1);

      // Generate the new fee grant allowance message.
      msgs.push(
        buildGrantAllowanceEncode(toKeepFeeGrant, butterConfig.desmosAddress, accountAddress),
      );

      // Push authz grant remove messages.
      msgs.push(
        ...buildRevokeGrantMsgEncodes(authorizations, butterConfig.desmosAddress, accountAddress),
      );

      // Broadcast the transaction.
      return broadcastTx(msgs, {
        onChain: true,
      });
    },
    [butterConfig, refetch, broadcastTx, accountAddress],
  );
};

export default useRemoveAuthorizations;
