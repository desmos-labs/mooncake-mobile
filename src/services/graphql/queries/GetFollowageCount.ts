import { gql } from '@apollo/client';

const GetFollowageCount = gql`
  query GetFollowageCount($subspaceId: bigint!, $userAddress: String!) @api(name: desmos) {
    followers: user_relationship_aggregate(
      where: { subspace_id: { _eq: $subspaceId }, creator_address: { _eq: $userAddress } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export interface GetFollowageCountGqlResponse {
  followers: {
    aggregate: {
      count: number;
    };
  };
}

export default GetFollowageCount;
