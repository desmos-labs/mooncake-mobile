import { gql } from '@apollo/client';

/**
 * Query to check if an user have a relationship with another
 * user in a specific subspace.
 *
 * Example:
 *
 * constants { data } = useQuery(GetUserRelationship, {
 *   variables: {
 *     creatorAddress: "desmos1...",
 *     counterpartyAddress: "desmos1...",
 *     subspaceId: 5
 *   }
 * })
 */
const GetUserRelationship = gql`
  query GetUserRelationship(
    $creatorAddress: String
    $counterpartyAddress: String
    $subspaceId: bigint
  ) @api(name: desmos) {
    relationship: user_relationship(
      where: {
        creator_address: { _eq: $creatorAddress }
        counterparty_address: { _eq: $counterpartyAddress }
        subspace_id: { _eq: $subspaceId }
      }
    ) {
      counterpartyAddress: counterparty_address
      creatorAddress: creator_address
      subspaceId: subspace_id
    }
  }
`;

export default GetUserRelationship;
