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
import { getLikeReactionId, PostReaction } from 'types/desmos';
import { useAppStateValue } from '@recoil/appState';
import { convertGraphQLPost } from 'lib/GraphQLUtils';
import GetPostReactions from 'services/graphql/queries/GetPostReactions';
import { convertGraphQLReaction } from 'lib/GraphQLUtils/reactions';
import useGetOnChainProfile from 'hooks/profiles/useGetOnChainProfile';
import { Post } from 'types/posts';

/**
 * Hook that allows to get the data of a post given its subspace and post ids.
 */
const useGetPostData = () => {
  const activeAddress = useActiveAccountAddress();
  if (!activeAddress) {
    throw new Error('Trying to get post data without active user');
  }

  const subspaceParams = useAppStateValue('subspaceParams');

  const [getPost] = useLazyQuery(GetPost, {
    fetchPolicy: 'cache-first',
  });

  return React.useCallback(
    async (subspaceId: number, postId: number): Promise<Post | undefined> => {
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

      return data.posts.length > 0 ? convertGraphQLPost(data.posts[0]) : undefined;
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
    async (
      subspaceId: number,
      postId: number,
      reactionId: number,
    ): Promise<PostReaction | undefined> => {
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
 */
const useGetCompleteData = () => {
  const getProfile = useGetOnChainProfile();
  const getPost = useGetPostData();
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
            user: await getProfile(data.userAddress),
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
const useNotificationsHistory = (notificationsPerPage: number = 20) => {
  const getCompleteData = useGetCompleteData();

  const [notifications, setNotifications] = useState<CompleteNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
      setLoading(false);
      setFetchingMore(false);
      setRefreshing(false);
    },
    [setLoading, getCompleteData, setNotifications],
  );

  // Query used to get the notifications
  const { refetch, fetchMore } = useQuery(GetNotifications, {
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
      setFetchingMore(false);
      setError(e.toString);
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
      setRefreshing(false);
      setError(e.toString());
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
