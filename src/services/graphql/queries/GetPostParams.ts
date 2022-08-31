import {gql} from '@apollo/client';

const GetProfileParams = gql`
  query GetPostsParams @api(name: desmos) {
    posts_params {
      params
    }
  }
`;

export default GetProfileParams;
