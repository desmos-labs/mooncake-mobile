import { gql } from '@apollo/client';

const GetReportsByUser = gql`
  query GetReportsByUser($subspaceId: bigint!, $user: String!, $target: jsonb!) @api(name: butter) {
    reports: report(
      where: {
        subspace_id: { _eq: $subspaceId }
        reporter_address: { _eq: $user }
        target: { _contains: $target }
      }
    ) {
      id
      creation_date
    }
  }
`;

export default GetReportsByUser;
