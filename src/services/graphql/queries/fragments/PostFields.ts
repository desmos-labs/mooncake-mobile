import { gql } from '@apollo/client';
import ProfileFields from 'services/graphql/queries/fragments/ProfilesFields';

const PostFields = gql`
  ${ProfileFields}
  fragment PostFields on post {
    id
    subspace_id
    section {
      id
    }
    reply_settings
    external_id
    conversation {
      id
    }
    text
    attachments {
      content_hash {
        hash
      }
      id
      content
      size {
        width
        height
      }
    }
    references {
      type
      position_index
      reference {
        id
      }
    }
    creation_date
    author {
      ...ProfileFields
    }
    transactions {
      hash
    }
    has_user_liked
    urls {
      start_index
      end_index
      url
      display_value
      preview_url
    }
    likes_count
    comments_count
  }
`;

export default PostFields;
