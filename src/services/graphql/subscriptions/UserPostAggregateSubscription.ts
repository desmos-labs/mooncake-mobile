import {gql} from '@apollo/client';

const UserPostAggregateSubscription = gql`
  subscription UserPostAggregateSubscription(
    $subspaceID: bigint!
    $userAddress: String!
  ) @api(name: butter) {
    post_aggregate(
      where: {
        subspace_id: {_eq: $subspaceID}
        _not: {conversation: {}}
        _and: {author_address: {_eq: $userAddress}}
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export default UserPostAggregateSubscription;
