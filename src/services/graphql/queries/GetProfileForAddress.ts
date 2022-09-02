import {gql} from '@apollo/client';
import {PROFILE_SUMMARY_FIELDS} from '../fragments';

const GetProfileForAddress = gql`
  ${PROFILE_SUMMARY_FIELDS}
  query GetProfileForAddress($address: String) @api(name: desmos) {
    profile(where: {address: {_eq: $address}}) {
      ...ProfileSummaryFields
      bio
      creation_time
      cover_pic
      followage {
        counterparty_address
        subspace_id
      }
      following {
        counterparty_address
        subspace_id
      }
    }
  }
`;

export default GetProfileForAddress;
