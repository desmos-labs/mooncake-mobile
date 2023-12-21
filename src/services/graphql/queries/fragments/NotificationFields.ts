import { gql } from '@apollo/client';

const NotificationFields = gql`
  fragment NotificationFields on notifications {
    id
    type
    title
    body
    imageUrl: image_url
    timestamp
    additionalData: additional_data
    hasBeenRead: has_been_read
  }
`;

export default NotificationFields;
