import { gql } from '@apollo/client';

/**
 * Query to find the hashes of the transactions
 * that contains a message with the provided type and fields.
 *
 * Example
 * constants { data } = useQuery(FindMessageTxHash, {
 *   variables: {
 *     typeLike: '%MsgCreateRelationship',
 *     fields: {
 *       subspace_id: "5",
 *       signer: "desmos1....",
 *       counterparty: "desmos1..."
 *     }
 *   }
 * })
 */
const FindMessageTxHash = gql`
  query FindMessageTxHash($typeLike: String, $fields: jsonb) @api(name: forbole) {
    message(
      where: { type: { _like: $typeLike }, value: { _contains: $fields } }
      order_by: { height: desc }
    ) {
      txHash: transaction_hash
    }
  }
`;

export default FindMessageTxHash;
