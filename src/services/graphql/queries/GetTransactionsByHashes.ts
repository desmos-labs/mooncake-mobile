import { gql } from '@apollo/client';

const GetTransactionsByHashes = gql`
  query GetTransactionsCountByHash($hashes: [String!]) @api(name: forbole) {
    message(where: { transaction_hash: { _in: $hashes } }) {
      transaction_hash
    }
  }
`;

export default GetTransactionsByHashes;
