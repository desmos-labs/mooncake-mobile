import {gql} from '@apollo/client';

const GetProfileForAddress =
  gql(`query GetProfileForAddress($address: String) @api(name: desmos) {
  profile(where: {address: {_eq: $address}}) {
    address
    bio
    cover_pic
    dtag
    profile_pic
    nickname
    followage_aggregate {
      aggregate {
        count
      }
    }
    following_aggregate {
      aggregate {
        count
      }
    }
  }
}
`);

export default GetProfileForAddress;
