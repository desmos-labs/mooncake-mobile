import {gql} from '@apollo/client';

const GetInvites = gql`
  query Invites @api(name: butter) {
    invite {
      claimer {
        dtag
        address
        nickname
        profile_pic
      }
      code
      link
      creation_time
      expiration_time
    }
  }
`;

export default GetInvites;
