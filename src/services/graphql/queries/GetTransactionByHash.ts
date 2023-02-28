import { gql } from '@apollo/client';

const GetTransactionsCountByHash = gql`
  query GetTransactionsCountByHash($hash: String!) @api(name: forbole) {
    message_aggregate(where: { transaction_hash: { _eq: $hash } }) {
      aggregate {
        count
      }
    }
  }
`;

export default GetTransactionsCountByHash;
