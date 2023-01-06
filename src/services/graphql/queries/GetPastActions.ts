import {gql} from '@apollo/client';

const GetPastActions = gql`
  query PastActions($userAddress: String, $limit: bigint!, $offset: bigint!)
  @api(name: butter) {
    messages_by_address(
      args: {address: $userAddress, limit: $limit, offset: $offset}
      order_by: {height: desc}
    ) {
      transaction_hash
      index
      type
      value
      involved_accounts_addresses
      fees
      timestamp
    }
  }
`;

export default GetPastActions;
