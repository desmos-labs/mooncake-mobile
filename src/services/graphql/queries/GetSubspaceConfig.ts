import { gql } from '@apollo/client';

/**
 * A query that retrieves the report, reaction, and tips config from gql.
 */
const GetSubspaceConfig = gql`
  query GetSubspaceConfig($subspaceId: bigint!) @api(name: butter) {
    report_reasons: subspace_report_reason(where: { subspace_id: { _eq: $subspaceId } }) {
      id
      title
      description
    }
    registered_reactions: subspace_registered_reaction(
      where: { subspace_id: { _eq: $subspaceId } }
    ) {
      id
      display_value
      shorthand_code
    }
    contracts: contract(where: { type: { _ilike: "tips" } }) {
      address
      type
      config
    }
  }
`;

export default GetSubspaceConfig;
