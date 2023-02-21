import { useQuery } from '@apollo/client';
import GetUserTweets from 'services/graphql/queries/GetUserTweets';
import { convertGraphQLTwitterData } from 'lib/GraphQLUtils/twitter';

/**
 * Hook that allows to query the Twitter data for the user having the given username.
 * @param username {string} - The username of the user.
 * @param count {number} - The number of tweets to retrieve.
 */
const useTwitterData = (username: string, count: number = 25) => {
  const { data, loading, refetch, error } = useQuery(GetUserTweets, {
    variables: { username, count },
  });

  const twitterData = convertGraphQLTwitterData(data);

  return {
    user: twitterData?.user,
    tweets: twitterData?.tweets ?? [],
    loading,
    refetch,
    error: error?.message,
  };
};

export default useTwitterData;
