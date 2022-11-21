import {gql} from '@apollo/client';

/**
 * A query that retrieves the report, reaction, and tips config from gql.
 */
const GetAppConfig = gql`
  query GetAppConfig($subspaceID: bigint!) @api(name: desmos) {
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
    profiles_params {
      params
    }
    posts_params {
      params
    }
  }
`;

export default GetAppConfig;
