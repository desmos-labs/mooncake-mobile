import { gql } from '@apollo/client';
import RelationshipFields from 'services/graphql/queries/fragments/RelationshipFields';

const GetRelationshipForAddress = gql`
  ${RelationshipFields}
  query GetRelationshipForAddress(
    $subspaceId: bigint!
    $userAddress: String!
    $counterpartyAddress: String!
  ) @api(name: desmos) {
    relationships: user_relationship(
      where: {
        subspace_id: { _eq: $subspaceId }
        creator_address: { _eq: $userAddress }
        counterparty_address: { _eq: $counterpartyAddress }
      }
    ) {
      ...RelationshipFields
    }
  }
`;

export default GetRelationshipForAddress;
