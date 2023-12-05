import { DocumentNode, useSubscription } from '@apollo/client';
import { useCallback, useRef } from 'react';
import { useIsFocused, useRoute } from '@react-navigation/native';
import { NavProps } from 'screens/Home';
import { OnDataOptions } from '@apollo/client/react/types/types';
import { useAppStateValue } from '@recoil/appState';
import { useActiveAccountAddress } from '@recoil/accounts';
import { OperationVariables } from '@apollo/client/core';
import DiscoveryPostsCount from 'services/graphql/subscriptions/DiscoveryPostsCount';
import FollowingPostsCount from 'services/graphql/subscriptions/FollowingPostsCount';
import useFollowingAddresses from 'hooks/relationships/useFollowingAddresses';
import { debounce } from 'lodash';
import ROUTES from 'navigation/routes';
import useToast from 'hooks/toasts/useToast';
import { ToastType } from 'config/toast/toastConfig';
import { useTranslation } from 'react-i18next';

/**
 * Hook that allows to observe a generic posts count subscription,
 * performing a specific operation when there are new posts.
 * @param subscription {DocumentNode} - Subscription that will be observed
 * @param variables {any} - Variables used inside the subscription.
 * @param onNewPosts {Function} - Function called when a new data is retrieved.
 * @param waitTimeSeconds {number} - Minimum amount of time, in seconds, to wait between one notification and the other.
 */
const usePostsCountSubscription = <TVariables extends OperationVariables | undefined>(
  subscription: DocumentNode,
  variables: TVariables,
  onNewPosts: () => void,
  waitTimeSeconds: number = 30,
) => {
  // Reference to the last retrieved posts count for the subscription
  const postsCount = useRef<number>(0);

  // Callback that is used in order to update the current posts count
  // and perform the given action when there are new posts
  const onNewData = useCallback(
    (options: OnDataOptions) => {
      const retrievedCount = options.data?.data?.posts?.aggregate?.count || 0;
      if (retrievedCount > postsCount.current) {
        if (postsCount.current > 0) {
          // Only notify the listener after the first data retrieval.
          // This will avoid the notification to be shown immediately
          // after the subscription is created.
          onNewPosts();
        }
        postsCount.current = retrievedCount;
      }
    },
    [onNewPosts],
  );

  // We use a debounced callback of 30 seconds in order to avoid
  // spamming the user with new notifications continuously
  const debouncedCallback = debounce(onNewData, waitTimeSeconds * 1000);

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
  const { t } = useTranslation();
  const showToast = useToast();
  const isFocused = useIsFocused();
  const { name: routeName } = useRoute<NavProps['route']>();

  const subspaceId = useAppStateValue('subspaceId');
  const activeAddress = useActiveAccountAddress();

  const onNewDiscoveryPosts = useCallback(() => {
    if (!isFocused || routeName !== ROUTES.HOME_TAB_DISCOVER) return;
    showToast({
      toastType: ToastType.oneButton,
      message: t('there are new posts'),
      buttonLabel: t('refresh'),
      buttonAction: onPressNotification,
    });
  }, [isFocused, onPressNotification, routeName, showToast, t]);

  usePostsCountSubscription(
    DiscoveryPostsCount,
    {
      subspaceId,
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
  const { t } = useTranslation();
  const showToast = useToast();
  const isFocused = useIsFocused();
  const { name: routeName } = useRoute<NavProps['route']>();

  const subspaceId = useAppStateValue('subspaceId');
  const followingAddresses = useFollowingAddresses();

  const onNewFollowingPosts = useCallback(() => {
    if (!isFocused || routeName !== ROUTES.HOME_TAB_FOLLOWING) return;
    showToast({
      toastType: ToastType.oneButton,
      message: t('there are new posts'),
      buttonLabel: t('refresh'),
      buttonAction: onPressNotification,
    });
  }, [isFocused, onPressNotification, routeName, showToast, t]);

  usePostsCountSubscription(
    FollowingPostsCount,
    {
      subspaceId,
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
  }, [onPressNotification]);

  useWatchNewDiscoveryPosts(onPress);
  useWatchNewFollowingPosts(onPress);
};

export default useWatchForNewPosts;
