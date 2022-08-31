import {gql} from '@apollo/client';

export type GetFollowedUsersForAddressData = {
  user_relationship: Array<{
    counterparty: {
      dtag: string;
      nickname: string;
      address: string;
    };
  }>;
};

const GetFollowedUsersForAddress = gql`
  query Following($userAddress: String) @api(name: desmos) {
    user_relationship(
      where: {
        creator_address: {_eq: $userAddress}
        creator: {}
        counterparty: {}
      }
    ) {
      counterparty {
        dtag
        nickname
        address
      }
    }
  }
`;

export default GetFollowedUsersForAddress;
