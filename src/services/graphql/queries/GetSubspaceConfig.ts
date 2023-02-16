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
    tips_contract: contract(
      where: { type: { _ilike: "tips" }, config: { _contains: { subspace_id: $subspaceId } } }
    ) {
      address
      type
      config
    }
  }
`;

export default GetSubspaceConfig;
