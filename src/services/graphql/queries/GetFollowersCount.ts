import { gql } from '@apollo/client';

const GetFollowersCount = gql`
  query GetFollowersCount($subspaceId: bigint!, $userAddress: String!) @api(name: desmos) {
    followers: user_relationship_aggregate(
      where: {
        creator: { dtag: { _is_null: false } }
        subspace_id: { _eq: $subspaceId }
        counterparty_address: { _eq: $userAddress }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export default GetFollowersCount;
