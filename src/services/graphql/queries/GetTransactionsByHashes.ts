import { gql } from '@apollo/client';

const GetTransactionsByHashes = gql`
  query GetTransactionsCountByHash($hashes: [String!]) @api(name: forbole) {
    messages: message(where: { transaction_hash: { _in: $hashes } }) {
      transaction_hash
    }
  }
`;

export default GetTransactionsByHashes;
