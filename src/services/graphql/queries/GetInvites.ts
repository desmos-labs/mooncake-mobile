import { gql } from '@apollo/client';

const GetInvites = gql`
  query Invites @api(name: butter) {
    invite {
      claimer {
        address
        dtag
        nickname
        profile_pic
        cover_pic
        creation_time
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

export interface GqlInvite {
  claimer: {
    address: string;
    dtag: string;
    nickname: string;
    profile_pic: string | null;
    cover_pic: string | null;
    creation_time: string;
  } | null;
  code: string;
  link: string;
  /**
   * Invite creation time in iso string.
   */
  creation_time: string;
  expiration_time: string | null;
  inviter_address: string;
  claimer_address: string;
}

export interface GqlInvites {
  invite: GqlInvite[];
}

export default GetInvites;
