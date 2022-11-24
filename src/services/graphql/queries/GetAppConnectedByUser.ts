import {gql} from '@apollo/client';

const GetAppConnectedByUser = gql`
  query GetAppConnectedByUser($address: String) @api(name: desmos) {
    application_link(where: {user_address: {_eq: $address}}) {
      application
      creation_time
      username
      state
      result
    }
  }
`;

export default GetAppConnectedByUser;
