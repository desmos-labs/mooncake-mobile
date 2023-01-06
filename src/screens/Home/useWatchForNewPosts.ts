import {useSubscription} from '@apollo/client';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import _ from 'lodash';
import {
  PostAggregateSubscription,
  PostAggregateSubscriptionFollowing,
} from 'services/graphql/subscriptions/PostAggregateSubscription';
import EnvConfig from 'config/EnvConfig';
import {useRecoilValue} from 'recoil';
import {followingState} from '@recoil/following';
import ROUTES from 'navigation/routes';
import ToastConfig from 'config/ToastConfig';
import {useToast} from 'react-native-toast-notifications';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {NavProps} from 'screens/Home/index';
import {useTranslation} from 'react-i18next';
import appSettingsState from '@recoil/settings';
import useActiveAccount from 'hooks/useActiveAccount';

/**
 * Subscribe to new posts in discover and following tab and show a notification
 * when a new post is detected.
 *
 * @param {function} onPressNotification - What to do when the notification is pressed
 */
const useWatchForNewPosts = (onPressNotification: () => void) => {
  const {t} = useTranslation('home');
  const toast = useToast();
  const {params} = useRoute<NavProps['route']>();
  const {getState} = useNavigation();
  const {activeAddress} = useActiveAccount();
  const {newDiscPostNotification, newFollowPostNotification} =
    useRecoilValue(appSettingsState);
  const currentScreen: any =
    // @ts-ignore
    getState().history[_.get(getState(), 'history').length - 1 || 0].key;

  const isFocused = useIsFocused();

  const [hasNewDiscoverPosts, setHasNewDiscoverPosts] =
    useState<boolean>(false);
  const [hasNewFollowingPosts, setHasNewFollowingPosts] =
    useState<boolean>(false);
  const following = useRecoilValue(followingState);

  const followingAddrs = useMemo(() => {
    return following.map(x => x.address);
  }, [JSON.stringify(following)]);

  const {data: postAggregateData} = useSubscription(PostAggregateSubscription, {
    fetchPolicy: 'no-cache',
    variables: {
      subspaceID: EnvConfig.APP_SUBSPACE_ID,
      userAddress: activeAddress,
    },
  });

  const {data: postAggregateFollowingData} = useSubscription(
    PostAggregateSubscriptionFollowing,
    {
      fetchPolicy: 'no-cache',
      variables: {
        subspaceID: EnvConfig.APP_SUBSPACE_ID,
        followingAddrs,
      },
    },
  );

  const storedPostAggregate = useRef<number>(0);
  const storedPostAggregateFollowing = useRef<number>(0);

  const processData = useCallback((aggregateData: any) => {
    return _.get(aggregateData, 'post_aggregate.aggregate.count');
  }, []);

  /**
   * Watch discover posts
   */
  useEffect(() => {
    const numPosts = processData(postAggregateData);

    if (numPosts && numPosts !== storedPostAggregate.current) {
      if (storedPostAggregate.current !== 0) {
        setHasNewDiscoverPosts(true);
      }

      storedPostAggregate.current = numPosts;
    }
  }, [JSON.stringify(postAggregateData), storedPostAggregate.current]);

  /**
   * Watch following posts
   */
  useEffect(() => {
    const numPosts = processData(postAggregateFollowingData);

    if (numPosts && numPosts !== storedPostAggregate.current) {
      if (storedPostAggregateFollowing.current !== 0) {
        setHasNewFollowingPosts(true);
      }

      storedPostAggregateFollowing.current = numPosts;
    }
  }, [
    JSON.stringify(storedPostAggregateFollowing),
    storedPostAggregateFollowing.current,
  ]);

  /**
   * Show notification if new posts from following are detected
   */
  useEffect(() => {
    if (!newFollowPostNotification || !isFocused) return;

    if (
      hasNewFollowingPosts &&
      params?.type === 'following' &&
      currentScreen.includes(ROUTES.HOME_FOLLOWING)
    ) {
      toast.show(t('newFollowingPost'), {
        type: ToastConfig.SUCCESS,
        onPress: () => {
          onPressNotification();
          resetNewPostNotificationState();
        },
      });
    }
  }, [
    hasNewFollowingPosts,
    JSON.stringify(currentScreen),
    newFollowPostNotification,
    isFocused,
  ]);

  /**
   * Show notification if new posts from discover tab is detected
   */
  useEffect(() => {
    if (!newDiscPostNotification || !isFocused) return;

    if (
      hasNewDiscoverPosts &&
      params?.type === 'discover' &&
      currentScreen.includes(ROUTES.HOME_DISCOVER)
    ) {
      toast.show(t('newDiscoverPost'), {
        type: ToastConfig.SUCCESS,
        onPress: () => {
          onPressNotification();
          resetNewPostNotificationState();
        },
      });
    }
  }, [
    hasNewDiscoverPosts,
    JSON.stringify(currentScreen),
    newDiscPostNotification,
    isFocused,
  ]);

  // I think this function is pretty lightweight and doesn't need to be useCallback'd
  const resetNewPostNotificationState = () => {
    if (params.type === 'discover') setHasNewDiscoverPosts(false);
    else if (params.type === 'following') setHasNewFollowingPosts(false);
  };

  return {
    resetNewPostNotificationState,
  };
};

export default useWatchForNewPosts;
