import {gql} from '@apollo/client';

const GetRegisteredReactions = gql`
  query RegisteredReactions($subspaceID: bigint!, $limit: Int!, $offset: Int!)
  @api(name: desmos) {
    subspace_registered_reaction(
      where: {subspace_id: {_eq: $subspaceID}}
      limit: $limit
      offset: $offset
    ) {
      id
      display_value
      shorthand_code
    }
  }
`;

export default GetRegisteredReactions;
