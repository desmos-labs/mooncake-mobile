import { gql } from '@apollo/client';

const GetRelationshipForAddress = gql`
  query GetRelationshipForAddress(
    $subspaceId: bigint!
    $userAddress: String!
    $counterpartyAddress: String!
  ) @api(name: butter) {
    relationships: user_relationship(
      where: {
        subspace_id: { _eq: $subspaceId }
        creator_address: { _eq: $userAddress }
        counterparty_address: { _eq: $counterpartyAddress }
      }
    ) {
      creator_address
    }
  }
`;

export default GetRelationshipForAddress;
