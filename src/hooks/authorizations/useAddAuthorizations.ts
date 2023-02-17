import useGetAuthorizations from 'hooks/authorizations/useGetAuthorizationInformation';
import {
  buildGrantAllowanceEncode,
  buildGrantMsgEncodes,
  buildRevokeAllowanceEncode,
  getMissingAuthzPermissions,
  getMissingFeeGrantPermissions,
} from 'lib/AuthorizationsUtils';
import { EncodeObject } from '@cosmjs/proto-signing';
import { AllowedMsgAllowanceTypeUrl } from '@desmoslabs/desmjs';
import useButterConfig from 'hooks/useButterConfig';
import { err } from 'neverthrow';
import useBroadcastTx from 'hooks/useBroadcastTx';
import React from 'react';

/**
 * Hook that provides a function to add the necessary fee grants and authzs grant
 * so that the user can use the centralized API to perform such actions.
 * @param accountAddress - User's account address.
 */
const useAddAuthorizations = (accountAddress: string) => {
  const { refetch } = useGetAuthorizations(accountAddress, true);
  const { config: butterConfig } = useButterConfig();
  const broadcastTx = useBroadcastTx();

  return React.useCallback(
    async (authorizations: string[]) => {
      if (authorizations.length === 0) {
        return err(Error('No authorizations to add'));
      }

      if (butterConfig?.desmosAddress === undefined) {
        return err(Error('Butter config is not set'));
      }

      // Fetch the current configurations.
      const fetchAuthorizationsResult = await refetch();
      if (fetchAuthorizationsResult.isErr()) {
        return err(fetchAuthorizationsResult.error);
      }
      const { feeGrants, authzGrants } = fetchAuthorizationsResult.value;
      // Compute the missing permissions from the current one.
      const missingFeeGrants = getMissingFeeGrantPermissions(authorizations, feeGrants);
      const missingAuthzGrants = getMissingAuthzPermissions(authorizations, authzGrants);

      const msgs: EncodeObject[] = [];

      if (missingFeeGrants.length > 0) {
        // The fee grant module don't support the update, we need to remove it
        // and then add it back with the current user's fee grants plus the
        // new ones.
        if (feeGrants.length > 0) {
          msgs.push(buildRevokeAllowanceEncode(butterConfig.desmosAddress, accountAddress));
        }

        // Get the list of the current messages that have a fee grant.
        const newAuthorizations = feeGrants.flatMap(feeGrant => {
          if (feeGrant.allowance.typeUrl === AllowedMsgAllowanceTypeUrl) {
            return feeGrant.allowance.allowedMessages;
          } else {
            return [];
          }
        });

        // Add to the new authorizations list just the message types that weren't
        // there before.
        authorizations.forEach(authorization => {
          if (newAuthorizations.indexOf(authorization) === -1) {
            newAuthorizations.push(authorization);
          }
        });

        // Push the new fee grant allowance message.
        msgs.push(
          buildGrantAllowanceEncode(newAuthorizations, butterConfig.desmosAddress, accountAddress),
        );
      }

      if (missingAuthzGrants.length > 0) {
        // Push the new authz grants message.
        msgs.push(
          ...buildGrantMsgEncodes(missingAuthzGrants, butterConfig.desmosAddress, accountAddress),
        );
      }

      // Broadcast the transaction.
      return broadcastTx(msgs, {
        onChain: true,
      });
    },
    [butterConfig, refetch, broadcastTx, accountAddress],
  );
};

export default useAddAuthorizations;
