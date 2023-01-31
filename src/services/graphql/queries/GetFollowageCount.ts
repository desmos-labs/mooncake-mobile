import {gql} from '@apollo/client';

const GetFollowageCount = gql`
  query GetFollowageCount($userAddress: String!) @api(name: butter) {
    followers: user_relationship_aggregate(
      where: {creator_address: {_eq: $userAddress}
    ) {
      aggregate {
        count
      }
    }
  }
`;

export default GetFollowageCount;
