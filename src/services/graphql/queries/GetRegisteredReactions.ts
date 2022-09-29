import {gql} from '@apollo/client';

const GetRegisteredReactions = gql`
  query RegisteredReactions($subspaceID: bigint!) @api(name: desmos) {
    subspace_registered_reaction(where: {subspace_id: {_eq: $subspaceID}}) {
      id
      display_value
      shorthand_code
    }
  }
`;

export default GetRegisteredReactions;
