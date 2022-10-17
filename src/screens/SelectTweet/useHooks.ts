import {useFocusEffect, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useCallback} from 'react';
import GetTweetsGivenAnUsername from 'services/axios/requests/GetTweetsGivenAnUsername';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SELECT_TWEET>;

const useHooks = () => {
  const [loading, setLoading] = React.useState(false);
  const [tweets, setTweets] = React.useState([]);
  const [user, setUser] = React.useState<any>();
  const {
    params: {username},
  } = useRoute<NavProps['route']>();

  const getTweets = useCallback(async () => {
    try {
      setLoading(true);
      const response = await GetTweetsGivenAnUsername({username});
      if (response) {
        setUser(response.user);
        setTweets(response.tweets);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [loading, tweets, username]);

  useFocusEffect(
    useCallback(() => {
      getTweets();
    }, [username]),
  );

  return {
    loading,
    user,
    tweets,
    getTweets,
  };
};

export default useHooks;
