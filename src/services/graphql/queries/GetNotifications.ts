import {gql} from '@apollo/client';

const GetNotifications = gql`
  query UserNotifications($userAddress: String!, $limit: Int!, $offset: Int!)
  @api(name: desmos) {
    notification(
      where: {
        user_address: {_eq: $userAddress}
        _not: {data: {_contains: {type: "transaction_success"}}}
      }
      limit: $limit
      offset: $offset
    ) {
      user_address
      data
      timestamp
    }
  }
`;

export default GetNotifications;
