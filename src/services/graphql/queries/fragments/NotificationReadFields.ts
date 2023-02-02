import { gql } from '@apollo/client';

const NOTIFICATION_READ_FIELDS = gql`
  fragment NotificationReadFields on notification {
    read_receipts {
      read_time
    }
  }
`;

export default NOTIFICATION_READ_FIELDS;
