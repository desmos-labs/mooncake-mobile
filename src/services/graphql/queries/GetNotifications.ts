import {gql} from '@apollo/client';

const GetNotifications = gql`
  query UserNotifications($limit: Int!, $offset: Int!) @api(name: butter) {
    notification(
      where: {_not: {data: {_contains: {type: "transaction_success"}}}}
      limit: $limit
      offset: $offset
      order_by: {timestamp: desc}
    ) {
      user_address
      data
      timestamp
      type
    }
  }
`;

export default GetNotifications;
