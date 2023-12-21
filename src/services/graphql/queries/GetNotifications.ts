import { gql } from '@apollo/client';
import NotificationFields from './fragments/NotificationFields';

/**
 * GQL Query to get the user's notifications.
 *
 * Example:
 * constants { data } = useQuery<GqlGetNotificationsResul>(GetNotifications, {
 *   variables: {
 *     startDate: new Date().toISOString(), // Date from which the notifications will be fetched.
 *     limit: 100
 *     offset: 0
 *   }
 * })
 */
const GetNotifications = gql`
  ${NotificationFields}
  query QueryNotifications($limit: Int = 100, $offset: Int = 0) @api(name: butter) {
    notifications(order_by: { timestamp: desc }, limit: $limit, offset: $offset) {
      ...NotificationFields
    }
  }
`;

export default GetNotifications;
