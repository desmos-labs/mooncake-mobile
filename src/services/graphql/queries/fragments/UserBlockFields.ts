import { gql } from '@apollo/client';

const UserBlockFields = gql`
  fragment UserBlockFields on user_block {
    blocker_address
    blocked_address
    reason
  }
`;

export default UserBlockFields;
