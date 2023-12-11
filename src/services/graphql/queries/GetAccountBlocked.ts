import { gql } from '@apollo/client';
import UserBlockFields from 'services/graphql/queries/fragments/UserBlockFields';

const GetAccountBlocked = gql`
  ${UserBlockFields}
  query GetAccountBlocked($subspaceId: bigint!, $userAddress: String!, $limit: Int!, $offset: Int!)
  @api(name: desmos) {
    user_block(
      where: { subspace_id: { _eq: $subspaceId }, blocker_address: { _eq: $userAddress } }
      offset: $offset
      limit: $limit
    ) {
      ...UserBlockFields
    }
  }
`;

export default GetAccountBlocked;
