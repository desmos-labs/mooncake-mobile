import useGetAuthorizations from 'hooks/authorizations/useGetAuthorizationInformation';
import {
  buildGrantAllowanceEncodes,
  buildGrantMsgEncodes,
  getMissingAuthzPermissions,
  getMissingFeeGrantPermissions,
} from 'lib/AuthorizationsUtils';
import { EncodeObject } from '@cosmjs/proto-signing';
import useButterConfig from 'hooks/config/useButterConfig';
import { err } from 'neverthrow';
import useBroadcastTx from 'hooks/transactions/useBroadcastTx';
import React from 'react';

/**
 * Hook that provides a function to add the necessary fee grants and authzs grant
 * so that the user can use the centralized API to perform such actions.
 */
const useAddAuthorizations = () => {
  const getAuthorizations = useGetAuthorizations();
  const { config: butterConfig } = useButterConfig();
  const broadcastTx = useBroadcastTx();

  return React.useCallback(
    async (userAddress: string, authorizations: string[]) => {
      if (authorizations.length === 0) {
        return err(Error('No authorizations to add'));
      }

      if (butterConfig?.desmosAddress === undefined) {
        return err(Error('Butter config is not set'));
      }

      // Fetch the current configurations.
      const { feeGrants, authzGrants } = await getAuthorizations(userAddress);

      // Compute the missing permissions from the current one.
      const missingFeeGrants = getMissingFeeGrantPermissions(authorizations, feeGrants);
      const missingAuthzGrants = getMissingAuthzPermissions(authorizations, authzGrants);

      const msgs: EncodeObject[] = [];

      // Push the messages to update the fee-grant..
      msgs.push(
        ...buildGrantAllowanceEncodes(
          feeGrants,
          missingFeeGrants,
          butterConfig.desmosAddress,
          userAddress,
        ),
      );

      if (missingAuthzGrants.length > 0) {
        // Push the new authz grants message.
        msgs.push(
          ...buildGrantMsgEncodes(missingAuthzGrants, butterConfig.desmosAddress, userAddress),
        );
      }

      // Broadcast the transaction.
      return broadcastTx(msgs, {
        onChain: true,
      });
    },
    [butterConfig, getAuthorizations, broadcastTx],
  );
};

export default useAddAuthorizations;
