import {gql} from '@apollo/client';

const GetPostReactionForAddress = gql`
  query Reaction($postID: bigint!, $userAddress: String!) {
    reactions: reaction(
      where: {post: {id: {_eq: $postID}}, author_address: {_eq: $userAddress}}
    ) {
      id
      value
    }
  }
`;

export default GetPostReactionForAddress;
