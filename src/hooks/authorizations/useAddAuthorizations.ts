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

      // Push the messages to update the fee-grant..
      msgs.push(
        ...buildGrantAllowanceEncodes(
          feeGrants,
          missingFeeGrants,
          butterConfig.desmosAddress,
          accountAddress,
        ),
      );

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
