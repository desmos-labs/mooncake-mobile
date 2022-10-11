import {gql} from '@apollo/client';

const GetAllFollowers = gql`
  query GetFollowers($subspaceID: bigint!, $userAddress: String!)
  @api(name: desmos) {
    followers: user_relationship(
      where: {
        subspace_id: {_eq: $subspaceID}
        counterparty_address: {_eq: $userAddress}
        counterparty: {}
        creator: {}
      }
    ) {
      _: creator {
        address
      }
    }
  }
`;

export default GetAllFollowers;
