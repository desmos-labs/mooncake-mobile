import { gql } from '@apollo/client';
import UserBlockFields from 'services/graphql/queries/fragments/UserBlockFields';

const GetBlockedForAddress = gql`
  ${UserBlockFields}
  query GetBlockedForAddress(
    $subspaceId: bigint!
    $blockerAddress: String!
    $blockedAddress: String!
  ) @api(name: butter) {
    user_block(
      where: {
        subspace_id: { _eq: $subspaceId }
        blocker_address: { _eq: $blockerAddress }
        blocked_address: { _eq: $blockedAddress }
      }
    ) {
      ...UserBlockFields
    }
  }
`;

export default GetBlockedForAddress;
