import { gql } from '@apollo/client';

const NotificationReadFields = gql`
  fragment NotificationReadFields on notification {
    read_receipts {
      read_time
    }
  }
`;

export default NotificationReadFields;
