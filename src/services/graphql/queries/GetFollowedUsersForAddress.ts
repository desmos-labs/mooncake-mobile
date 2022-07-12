import {gql} from '@apollo/client';

const GetFollowedUsersForAddress = gql`
  query Following($userAddress: String) @api(name: desmos) {
    user_relationship(where: {creator_address: {_eq: $userAddress}}) {
      counterparty {
        dtag
        nickname
        address
      }
    }
  }
`;

export default GetFollowedUsersForAddress;
