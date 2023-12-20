import { gql } from '@apollo/client';

const GetTransactionsByAddress = gql`
  query GetTransactionsByAddress(
    $address: _text
    $limit: bigint = 20
    $offset: bigint = 0
    $types: _text = "{}"
  ) @api(name: forbole) {
    messages: messages_by_address(
      args: { addresses: $address, types: $types, limit: $limit, offset: $offset }
    ) {
      type
      value
      transaction_hash
      index
      transaction {
        fee
        block {
          timestamp
        }
      }
    }
  }
`;

export default GetTransactionsByAddress;
