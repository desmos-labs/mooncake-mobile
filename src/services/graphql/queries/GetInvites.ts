import {gql} from '@apollo/client';

const GetInvites = gql`
  query Invites @api(name: desmos) {
    invite {
      code
      link
      claimer {
        address
        dtag
        nickname
        profile_pic
      }
      creation_time
      expiration_time
    }
  }
`;

export default GetInvites;
