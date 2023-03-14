import React, { useState } from 'react';
import { useActiveAccountAddress } from '@recoil/accounts';
import {
  CompleteCommentNotification,
  CompleteCommentReactionNotification,
  CompleteFollowNotification,
  CompleteInviteClaimedNotification,
  CompleteInviteUnlockedNotification,
  CompleteNotification,
  CompletePostReactionNotification,
  CompleteReplyNotification,
  CompleteReplyReactionNotification,
  NotificationType,
} from 'types/notifications';
import { useLazyQuery, useQuery } from '@apollo/client';
import GetNotifications from 'services/graphql/queries/GetNotifications';
import { convertGraphQLNotification, GraphQLNotification } from 'lib/GraphQLUtils/notifications';
import GetPost from 'services/graphql/queries/GetPost';
import { getLikeReactionId } from 'types/desmos';
import { useAppStateValue } from '@recoil/appState';
import { convertGraphQLPost } from 'lib/GraphQLUtils';
import GetPostReactions from 'services/graphql/queries/GetPostReactions';
import { convertGraphQLReaction } from 'lib/GraphQLUtils/reactions';
import useGetOnChainProfile from 'hooks/profiles/useGetOnChainProfile';

/**
 * Hook that allows to get the data of a post given its subspace and post ids.
 * @param activeAddress {string} - Address of the currently active user.
 */
const useGetPostData = (activeAddress: string) => {
  const subspaceParams = useAppStateValue('subspaceParams');

  const [getPost] = useLazyQuery(GetPost, {
    fetchPolicy: 'cache-first',
  });

  return React.useCallback(
    async (subspaceId: number, postId: number) => {
      const { data } = await getPost({
        variables: {
          subspaceId,
          postId,
          user: activeAddress,
          reaction: {
            '@type': '/desmos.reactions.v1.RegisteredReactionValue',
            registered_reaction_id: getLikeReactionId(subspaceParams),
          },
        },
      });
      if (!data) {
        return undefined;
      }

      const { posts } = data;
      const [firstPost] = posts;
      return convertGraphQLPost(firstPost);
    },
    [activeAddress, getPost, subspaceParams],
  );
};

/**
 * Hook that allows to get the data of a reaction given the subspace, post and its id.
 */
const useGetReactionData = () => {
  const [getReaction] = useLazyQuery(GetPostReactions, {
    fetchPolicy: 'cache-first',
  });

  return React.useCallback(
    async (subspaceId: number, postId: number, reactionId: number) => {
      const { data } = await getReaction({
        variables: {
          subspaceId,
          postId,
          reactionId,
        },
      });
      if (!data) {
        return undefined;
      }

      const { reactions } = data;
      const [firstReactions] = reactions;
      return convertGraphQLReaction(firstReactions);
    },
    [getReaction],
  );
};

/**
 * Hook that allows to map a {@link GraphQLNotification} to a {@link CompleteNotification} data.
 * @param activeAddress {string} - Address of the currently active user.
 */
const useGetCompleteData = (activeAddress: string) => {
  const getProfile = useGetOnChainProfile();
  const getPost = useGetPostData(activeAddress);
  const getReaction = useGetReactionData();

  return React.useCallback(
    async (
      notification: GraphQLNotification | undefined,
    ): Promise<CompleteNotification | undefined> => {
      if (!notification) return undefined;

      const { data } = notification;
      switch (data.type) {
        case NotificationType.Comment:
          return {
            ...notification,
            ...data,
            type: NotificationType.Comment,
            comment: await getPost(data.subspaceId, data.commentId),
            post: await getPost(data.subspaceId, data.postId),
          } as CompleteCommentNotification;
        case NotificationType.Reply:
          return {
            ...notification,
            ...data,
            type: NotificationType.Reply,
            comment: await getPost(data.subspaceId, data.commentId),
            reply: await getPost(data.subspaceId, data.replyId),
          } as CompleteReplyNotification;
        case NotificationType.ReactionPost:
          return {
            ...notification,
            ...data,
            type: NotificationType.ReactionPost,
            post: await getPost(data.subspaceId, data.postId),
            reaction: await getReaction(data.subspaceId, data.postId, data.reactionId),
          } as CompletePostReactionNotification;
        case NotificationType.ReactionComment:
          return {
            ...notification,
            ...data,
            type: NotificationType.ReactionComment,
            conversation: await getPost(data.subspaceId, data.postId),
            comment: await getPost(data.subspaceId, data.commentId),
            reaction: await getReaction(data.subspaceId, data.commentId, data.reactionId),
          } as CompleteCommentReactionNotification;
        case NotificationType.ReactionReply:
          return {
            ...notification,
            ...data,
            type: NotificationType.ReactionReply,
            conversation: await getPost(data.subspaceId, data.postId),
            comment: await getPost(data.subspaceId, data.commentId),
            reply: await getPost(data.subspaceId, data.replyId),
            reaction: await getReaction(data.subspaceId, data.replyId, data.reactionId),
          } as CompleteReplyReactionNotification;
        case NotificationType.Follow:
          return {
            ...notification,
            ...data,
            type: NotificationType.Follow,
            user: await getProfile(data.follower),
          } as CompleteFollowNotification;
        case NotificationType.InviteClaimed:
          return {
            ...notification,
            ...data,
            type: NotificationType.InviteClaimed,
            claimer: await getProfile(data.claimerAddress),
          } as CompleteInviteClaimedNotification;
        case NotificationType.InviteUnlocked:
          return {
            ...notification,
            ...data,
            type: NotificationType.InviteUnlocked,
          } as CompleteInviteUnlockedNotification;
        default:
          return undefined;
      }
    },
    [getPost, getProfile, getReaction],
  );
};

/**
 * Hook that allows to get the notifications history of the current application user.
 */
const useNotificationsHistory = (notificationsPerPage: number = 50) => {
  const activeAddress = useActiveAccountAddress();
  if (!activeAddress) {
    throw new Error('Trying to get activities without active account');
  }

  const getCompleteData = useGetCompleteData(activeAddress);

  const [notifications, setNotifications] = useState<CompleteNotification[]>([]);
  const [fetchingMore, setFetchingMore] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  // Callback that is used when some data is returned by the chain
  const onCompletedCallback = React.useCallback(
    async (data: any) => {
      if (!data) return;

      const onChainNotifications = (data.notifications as any[]).map(convertGraphQLNotification);

      const completeNotifications: CompleteNotification[] = [];

      // It's fine to disable the next line warning as using a for loop makes it easier to read the code here
      // eslint-disable-next-line no-restricted-syntax
      for (const notification of onChainNotifications) {
        // It's fine to disable the next line warning as we need an await, and it makes it easier to
        // read the code without having to use Promise.all
        // eslint-disable-next-line no-await-in-loop
        const completeNotification = await getCompleteData(notification);
        completeNotification && completeNotifications.push(completeNotification);
      }

      setNotifications(completeNotifications);
    },
    [getCompleteData, setNotifications],
  );

  // Query used to get the notifications
  const { loading, refetch, fetchMore } = useQuery(GetNotifications, {
    variables: {
      offset: 0,
      limit: notificationsPerPage,
    },
    onCompleted: onCompletedCallback,
    refetchWritePolicy: 'overwrite',
  });

  // Callback that is used to fetch the next page of notifications
  const fetchMoreNotifications = React.useCallback(async () => {
    try {
      setError(undefined);
      setFetchingMore(true);

      // Fetch more notifications
      await fetchMore({
        variables: { offset: notifications.length },
        updateQuery: (prev, { fetchMoreResult }) => ({
          notifications: fetchMoreResult
            ? [...prev.notifications, ...fetchMoreResult.notifications]
            : prev,
        }),
      });
    } catch (e: any) {
      setError(e.toString);
    } finally {
      // Make sure to set the fetching to false in any case
      setFetchingMore(false);
    }
  }, [fetchMore, notifications.length]);

  // Callback that is used in order to re-fetch the entire list of notifications
  const refetchNotifications = React.useCallback(async () => {
    try {
      setError(undefined);
      setRefreshing(true);

      // Get the new data by resetting the fetch offset to restart post fetching
      const { data } = await refetch({ offset: 0 });
      onCompletedCallback(data);
    } catch (e: any) {
      setError(e.toString());
    } finally {
      // Make sure to set the fetching to false in any case
      setRefreshing(false);
    }
  }, [onCompletedCallback, refetch]);

  return {
    notifications,
    loading,
    fetchMore: fetchMoreNotifications,
    fetchingMore,
    refresh: refetchNotifications,
    refreshing,
    error,
  };
};

export default useNotificationsHistory;
