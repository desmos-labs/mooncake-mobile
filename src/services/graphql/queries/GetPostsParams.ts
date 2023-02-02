import { gql } from '@apollo/client';

const GetPostsParams = gql`
  query ProfileParams @api(name: desmos) {
    params: posts_params {
      params
    }
  }
`;

export default GetPostsParams;
