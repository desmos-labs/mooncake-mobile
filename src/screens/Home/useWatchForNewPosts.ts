import { DocumentNode, useSubscription } from '@apollo/client';
import { useCallback, useRef } from 'react';
import ToastConfig from 'config/ToastConfig';
import { useToast } from 'react-native-toast-notifications';
import { useIsFocused, useRoute } from '@react-navigation/native';
import { NavProps } from 'screens/Home';
import { useTranslation } from 'react-i18next';
import { OnDataOptions } from '@apollo/client/react/types/types';
import { useAppStateValue } from '@recoil/appState';
import { useActiveAccountAddress } from '@recoil/accounts';
import { OperationVariables } from '@apollo/client/core';
import DiscoveryPostsCount from 'services/graphql/subscriptions/DiscoveryPostsCount';
import FollowingPostsCount from 'services/graphql/subscriptions/FollowingPostsCount';
import useFollowingAddresses from 'hooks/useFollowingAddresses';
import { debounce } from 'lodash';

/**
 * Hook that allows to observe a generic posts count subscription,
 * performing a specific operation when there are new posts.
 * @param subscription {DocumentNode} - Subscription that will be observed
 * @param variables {any} - Variables used inside the subscription.
 * @param onNewPosts {Function} - Function called when a new data is retrieved.
 */
const usePostsCountSubscription = <TVariables = OperationVariables>(
  subscription: DocumentNode,
  variables: TVariables,
  onNewPosts: () => void,
) => {
  // Reference to the last retrieved posts count for the subscription
  const postsCount = useRef<number>(0);

  // Callback that is used in order to update the current posts count
  // and perform the given action when there are new posts
  const onNewData = useCallback(
    (options: OnDataOptions) => {
      const retrievedCount = options.data?.data?.posts?.aggregate?.count || 0;
      if (retrievedCount !== 0 && retrievedCount !== postsCount) {
        postsCount.current = retrievedCount;
        onNewPosts();
      }
    },
    [postsCount.current],
  );

  // We use a debounced callback of 30 seconds in order to avoid
  // spamming the user with new notifications continuously
  const debouncedCallback = debounce(onNewData, 30 * 1000);

  useSubscription(subscription, {
    variables,
    onData: debouncedCallback,
  });
};

/**
 * Hook that allows to observe new posts that are placed inside the Discovery section of the user.
 * Each time there is a new post, a notification is shown.
 * @param onPressNotification {Function} - Function that is called when the user presses the notification.
 */
const useWatchNewDiscoveryPosts = (onPressNotification: () => void) => {
  const { t } = useTranslation('home');
  const toast = useToast();
  const isFocused = useIsFocused();
  const { name: routeName } = useRoute<NavProps['route']>();

  const subspaceId = useAppStateValue('subspaceId');
  const activeAddress = useActiveAccountAddress();

  const onNewDiscoveryPosts = useCallback(() => {
    if (!isFocused || routeName !== 'HOME_DISCOVER') return;
    toast.show(t('newDiscoverPost'), {
      type: ToastConfig.SUCCESS,
      onPress: onPressNotification,
    });
  }, []);

  usePostsCountSubscription(
    DiscoveryPostsCount,
    {
      subspaceID: subspaceId,
      userAddress: activeAddress,
    },
    onNewDiscoveryPosts,
  );
};

/**
 * Hook that allows to observe new posts form the users that the current application user is following.
 * Each time there is a new post, a notification will be shown to the user.
 * @param onPressNotification {Function} - Function that is called when the user presses the notification.
 */
const useWatchNewFollowingPosts = (onPressNotification: () => void) => {
  const { t } = useTranslation('home');
  const toast = useToast();
  const isFocused = useIsFocused();
  const { name: routeName } = useRoute<NavProps['route']>();

  const subspaceId = useAppStateValue('subspaceId');
  const followingAddresses = useFollowingAddresses();

  const onNewFollowingPosts = useCallback(() => {
    if (!isFocused || routeName !== 'HOME_FOLLOWING') return;
    toast.show(t('newFollowingPost'), {
      type: ToastConfig.SUCCESS,
      onPress: onPressNotification,
    });
  }, []);

  usePostsCountSubscription(
    FollowingPostsCount,
    {
      subspaceID: subspaceId,
      userAddress: followingAddresses,
    },
    onNewFollowingPosts,
  );
};

/**
 * Subscribe to new posts and show a notification when a new post is detected.
 * @param {function} onPressNotification - What to do when the notification is pressed
 */
const useWatchForNewPosts = (onPressNotification: () => void) => {
  // Callback used when the user presses a notification
  const onPress = useCallback(() => {
    onPressNotification();
  }, []);

  useWatchNewDiscoveryPosts(onPress);
  useWatchNewFollowingPosts(onPress);
};

export default useWatchForNewPosts;
