import { gql } from '@apollo/client';
import UserBlockFields from 'services/graphql/queries/fragments/UserBlockFields';

const GetRelationshipForAddress = gql`
  ${UserBlockFields}
  query GetRelationshipForAddress(
    $subspaceId: bigint!
    $blocker_address: String!
    $counterpartyAddress: String!
  ) @api(name: butter) {
    relationships: user_relationship(
      where: {
        subspace_id: { _eq: $subspaceId }
        blocker_address: { _eq: blocker_address }
        counterparty_address: { _eq: $counterpartyAddress }
      }
    ) {
      ...UserBlockFields
    }
  }
`;

export default GetRelationshipForAddress;
