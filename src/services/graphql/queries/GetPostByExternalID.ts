import { gql } from '@apollo/client';
import PostFields from 'services/graphql/queries/fragments/PostFields';

const GetPostByExternalID = gql`
  ${PostFields}
  query GetPost($externalId: String!) @api(name: butter) {
    posts: post(where: { external_id: { _ilike: $externalId } }) {
      ...PostFields
    }
  }
`;

export default GetPostByExternalID;
