import { gql } from '@apollo/client';

const GetInvites = gql`
  query Invites @api(name: butter) {
    invite {
      claimer {
        address
        dtag
        address
        nickname
        profile_pic
      }
      code
      link
      creation_time
      expiration_time
      inviter_address
      claimer_address
    }
  }
`;

export default GetInvites;
