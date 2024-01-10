import { Bank, Posts, Relationships, Reactions, Profiles, Reports } from '@desmoslabs/desmjs';
import { PastTransactionMessage } from 'types/transactions';

/**
 * Returns the sender address of the message received from the GraphQL server.
 * @param data - The data received from the GraphQL server.
 */
const getMessageSenderAddress = (data: any) => {
  switch (`/${data.type}`) {
    case Posts.v3.MsgCreatePostTypeUrl:
      return data.value.author;
    case Relationships.v1.MsgCreateRelationshipTypeUrl:
      return data.value.signer;
    case Relationships.v1.MsgDeleteRelationshipTypeUrl:
      return data.value.signer;
    case Relationships.v1.MsgBlockUserTypeUrl:
      return data.value.blocker;
    case Relationships.v1.MsgUnblockUserTypeUrl:
      return data.value.blocker;
    case Reactions.v1.MsgAddReactionTypeUrl:
      return data.value.user;
    case Reactions.v1.MsgRemoveReactionTypeUrl:
      return data.value.user;
    case Profiles.v3.MsgSaveProfileTypeUrl:
      return data.value.creator;
    case Profiles.v3.MsgDeleteProfileTypeUrl:
      return data.value.creator;
    case Reports.v1.MsgCreateReportTypeUrl:
      return data.value.reporter;
    case Bank.v1beta1.MsgSendTypeUrl:
      return data.value.from_address;
    default:
      return undefined;
  }
};

/**
 * Converts the received past tx from the GraphQL server into the format supported by the app.
 * @param data - The data received from the GraphQL server.
 */
// It's fine to disable the rule here, as we might want to export more functions in the future.
// eslint-disable-next-line import/prefer-default-export
export const convertGraphQLTransactionMessage = (data: any): PastTransactionMessage => {
  return {
    type: data.type,
    fees: data.transaction.fee.amount,
    timestamp: data.transaction.block.timestamp,
    index: data.index,
    hash: data.transaction_hash,
    senderAddress: getMessageSenderAddress(data),
  };
};
