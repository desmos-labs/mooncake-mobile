import { gql } from '@apollo/client';

const GetTransactionsByAddress = gql`
  query GetTransactionsByAddress(
    $address: String!
    $limit: bigint = 20
    $offset: bigint = 0
    $types: _text = "{}"
  ) @api(name: butter) {
    messages: messages_by_address(
      args: { address: $address, types: $types, limit: $limit, offset: $offset }
    ) {
      type
      value
      transaction_hash
      fees
      timestamp
      index
    }
  }
`;

export default GetTransactionsByAddress;
