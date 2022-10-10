import {gql} from '@apollo/client';

const GetPostsTippedForAddress = gql`
  query TippedUserPosts($subspaceID: bigint, $address: String)
  @api(name: desmos) {
    tips(
      where: {
        post: {subspace_id: {_eq: $subspaceID}}
        sender_address: {_eq: $address}
      }
    ) {
      post {
        id
        creation_date
        author_address
        attachments {
          id
          content
        }
        author {
          address
          bio
          dtag
          profile_pic
          nickname
        }
        subspace_id
        reactions {
          id
          value
        }
        reactions_aggregate {
          aggregate {
            count
          }
        }
        text
        conversation {
          author {
            address
          }
        }
      }
    }
  }
`;

export default GetPostsTippedForAddress;
