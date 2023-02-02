import { gql } from '@apollo/client';
import NOTIFICATION_READ_FIELDS from 'services/graphql/queries/fragments/NotificationReadFields';

const GetNotifications = gql`
  ${NOTIFICATION_READ_FIELDS}
  query UserNotifications($limit: Int!, $offset: Int!) @api(name: butter) {
    notification(
      where: { _not: { data: { _contains: { type: "transaction_success" } } } }
      limit: $limit
      offset: $offset
      order_by: { timestamp: desc }
    ) {
      id
      user_address
      data
      timestamp
      type
      ...NotificationReadFields
    }
  }
`;

export default GetNotifications;
