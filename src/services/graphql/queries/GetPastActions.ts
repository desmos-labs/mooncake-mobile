import { gql } from '@apollo/client';

const GetPastActions = gql`
  query GetPastActions($userAddress: String, $limit: bigint!, $offset: bigint!) @api(name: butter) {
    messages_by_address(
      args: { address: $userAddress, limit: $limit, offset: $offset }
      order_by: { height: desc }
    ) {
      transaction_hash
      height
      index
      type
      value
      fees
      timestamp
    }
  }
`;

export default GetPastActions;
