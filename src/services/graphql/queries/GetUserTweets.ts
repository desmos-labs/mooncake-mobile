import { gql } from '@apollo/client';

const GetUserTweets = gql`
  query GetUserTweets($username: String!, $count: Int!) {
    user_tweet(username: $username, count: $count) {
      user {
        username
        profile_pic
        name
      }
      tweets {
        id
        text
        attachments {
          id
          url
        }
        creation_date
      }
    }
  }
`;

export default GetUserTweets;
