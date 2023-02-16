import { gql } from '@apollo/client';

const GetFollowersCount = gql`
  query GetFollowersCount($userAddress: String!) @api(name: butter) {
    followers: user_relationship_aggregate(where: { counterparty_address: { _eq: $userAddress } }) {
      aggregate {
        count
      }
    }
  }
`;

export default GetFollowersCount;
