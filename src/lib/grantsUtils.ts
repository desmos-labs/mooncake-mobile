import { ApolloClient } from '@apollo/client';
import { Feegrant } from '@desmoslabs/desmjs';
import { err, ok, Result } from 'neverthrow';
import GetAccountFeeGrantAllowance from 'services/graphql/queries/desmos/GetAccountFeeGrantAllowance';
import { FeeGrant } from 'types/authorizations';
import { convertGraphQLFeeGrant } from './GraphQLUtils';

const GRANTER_ADDRESS = 'desmos12l00q6xyjgd7ph88etyl85ykzec30cnvxz6g2m';

/**
 * Function to check if the provided {@link FeeGrant} can be used for the provided
 * message.
 * @param feeGrant - The {@link FeeGrant} to check.
 * @param messageType - The message type to check.
 */
const hasFeeGrantForMessage = (feeGrant: FeeGrant, messageType: string): boolean => {
  const now = new Date();
  // Check grant expiration date.
  if (feeGrant.expirationDate && feeGrant.expirationDate.getTime() <= now.getTime()) {
    return false;
  }

  switch (feeGrant.allowance.typeUrl) {
    case Feegrant.v1beta1.BasicAllowanceTypeUrl:
      // If we have an expiration lets check that is in the future.
      if (feeGrant.allowance.expiration) {
        return feeGrant.allowance.expiration.getTime() > now.getTime();
      }
      // No expiration, we have the grant.
      return true;
    case Feegrant.v1beta1.AllowedMsgAllowanceTypeUrl:
      // Check that the message is allowed
      if (feeGrant.allowance.allowedMessages.includes(messageType)) {
        // Check if the grant has expired.
        if (feeGrant.expirationDate && feeGrant.expirationDate.getTime() <= now.getTime()) {
          return false;
        }
        return true;
      }
      return false;
    default:
      return false;
  }
};

/**
 * Gets the on chain grants for the user with the provided address.
 * @param client - The Apollo client that will be used to perform the query.
 * @param address - The address of the user to get the on chain grants for.
 */
export const getOnChainGrants = async (
  client: ApolloClient<{}>,
  address: string,
): Promise<Result<FeeGrant[], Error>> => {
  const { data, error } = await client.query({
    query: GetAccountFeeGrantAllowance,
    fetchPolicy: 'network-only',
    variables: {
      granteeAddress: address,
      granterAddress: GRANTER_ADDRESS,
    },
  });

  if (error) {
    return err(error);
  }

  const feeGrants = ((data.fee_grants as any[]) ?? []).map(convertGraphQLFeeGrant);
  return ok(feeGrants);
};

/**
 * Checks if inside the provided list of {@link FeeGrant} there is a
 * {@link FeeGrant} that can be used to broadcast a transaction that contains
 * the messages that have the provided messages types.
 * @param feeGrants - The list of {@link FeeGrant} to check.
 * @param messagesTypes - The messages types to check.
 */
export const getFeeGrantAllowanceForMessages = (
  feeGrants: FeeGrant[],
  messagesTypes: string[],
): FeeGrant | undefined => {
  return feeGrants.find(grant => {
    const missingMessage = messagesTypes.find(type => !hasFeeGrantForMessage(grant, type));
    return missingMessage === undefined;
  });
};

/**
 * Checks if inside the provided list of {@link FeeGrant} there is a
 *  {@link FeeGrant} that can be used to perform a `MsgSaveProfile`
 *  and return the found {@link FeeGrant} .
 */
export const getSaveProfileAllowance = (feeGrants: FeeGrant[]): FeeGrant | undefined => {
  return getFeeGrantAllowanceForMessages(feeGrants, ['/desmos.profiles.v3.MsgSaveProfile']);
};

/**
 * Checks if inside the provided list of {@link FeeGrant} there is a
 *  {@link FeeGrant} that can be used to perform a `MsgSaveProfile`.
 */
export const hasSaveProfileAllowance = (feeGrants: FeeGrant[]): boolean => {
  return getSaveProfileAllowance(feeGrants) !== undefined;
};

export default GRANTER_ADDRESS;
