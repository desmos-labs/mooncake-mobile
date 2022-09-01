import {gql} from '@apollo/client';

export const PAGINATED_FOLLOWERS = gql`
  fragment PaginatedFollowersFields on user_relationship {
    _: creator {
      dtag
      nickname
      profile_pic
      address
    }
  }
`;

export const PAGINATED_FOLLOWING = gql`
  fragment PaginatedFollowingFields on user_relationship {
    _: counterparty {
      dtag
      nickname
      profile_pic
      address
    }
  }
`;
