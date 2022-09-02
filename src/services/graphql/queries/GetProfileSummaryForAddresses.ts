import {gql} from '@apollo/client';
import {PROFILE_SUMMARY_FIELDS} from '../fragments';

const GetProfileSummaryForAddresses = gql`
  ${PROFILE_SUMMARY_FIELDS}
  query GetProfileSummaryForAddresses($addresses: String!) @api(name: desmos) {
    profile(where: {address: {_in: $addresses}}) {
      ...ProfileSummaryFields
    }
  }
`;

export default GetProfileSummaryForAddresses;
