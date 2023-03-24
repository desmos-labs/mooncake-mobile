import useGetAuthorizations from 'hooks/authorizations/useGetAuthorizationInformation';
import { buildRevokeAllowanceEncodes, buildRevokeGrantMsgEncodes } from 'lib/AuthorizationsUtils';
import { EncodeObject } from '@cosmjs/proto-signing';
import useButterConfig from 'hooks/config/useButterConfig';
import { err } from 'neverthrow';
import useBroadcastTx from 'hooks/transactions/useBroadcastTx';
import React from 'react';

/**
 * Hook that provide a function to revoke some fee grants and authzs grants.
 * @param accountAddress - User's account address.
 */
const useRemoveAuthorizations = (accountAddress: string) => {
  const getAuthorizations = useGetAuthorizations(accountAddress);
  const { config: butterConfig } = useButterConfig();
  const broadcastTx = useBroadcastTx();

  return React.useCallback(
    async (authorizations: string[]) => {
      if (authorizations.length === 0) {
        return err(Error('No authorizations to remove'));
      }

      if (butterConfig?.desmosAddress === undefined) {
        return err(Error('Butter config is not set'));
      }

      // Fetch the current configurations.
      const { feeGrants } = await getAuthorizations();
      const msgs: EncodeObject[] = [];

      // Push the messages to update the fee-grant.
      msgs.push(
        ...buildRevokeAllowanceEncodes(
          feeGrants,
          authorizations,
          butterConfig.desmosAddress,
          accountAddress,
        ),
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
    [butterConfig, getAuthorizations, accountAddress, broadcastTx],
  );
};

export default useRemoveAuthorizations;
