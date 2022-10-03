import {gql} from '@apollo/client';

const GetRegisteredReports = gql`
  query ReportingReasons($subspaceID: bigint!) @api(name: desmos) {
    subspace_report_reason(where: {subspace_id: {_eq: $subspaceID}}) {
      id
      title
    }
  }
`;

export default GetRegisteredReports;
