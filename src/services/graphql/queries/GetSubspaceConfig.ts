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
  }
`;

export default GetSubspaceConfig;
