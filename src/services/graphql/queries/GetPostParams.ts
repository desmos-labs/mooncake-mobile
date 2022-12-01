import {gql} from '@apollo/client';

const GetProfileParams = gql`
  query GetPostsParams @api(name: butter) {
    posts_params {
      params
    }
  }
`;

export default GetProfileParams;
