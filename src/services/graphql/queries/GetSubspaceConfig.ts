import {gql} from '@apollo/client';

/**
 * A query that retrieves the report, reaction, and tips config from gql.
 */
const GetSubspaceConfig = gql`
  query GetSubspaceConfig($subspaceID: bigint!) @api(name: butter) {
    subspace_report_reason(where: {subspace_id: {_eq: $subspaceID}}) {
      id
      title
    }
    subspace_registered_reaction(where: {subspace_id: {_eq: $subspaceID}}) {
      id
      display_value
      shorthand_code
    }
    contract(
      where: {
        type: {_ilike: "tips"}
        config: {_contains: {subspace_id: $subspaceID}}
      }
    ) {
      address
      type
      config
    }
  }
`;

export default GetSubspaceConfig;
