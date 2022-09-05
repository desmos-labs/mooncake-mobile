import {useQuery} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';
import appSettingsState from '@recoil/settings';
import {utcToZonedTime} from 'date-fns-tz';
import ROUTES from 'navigation/routes';
import React, {useMemo} from 'react';
import {useRecoilState} from 'recoil';
import {NavProps} from 'screens/PostDetails/index';
import {GetPostComments} from 'services/graphql/queries/GetComments';
import GetPostBySubspaceIDandPostID from 'services/graphql/queries/GetPostBySubspaceIDandPostID';
import GetPostReactions from 'services/graphql/queries/GetReactions';

const useHooks = ({id, sId}: {id: number; sId: number}) => {
  const [settings] = useRecoilState(appSettingsState);
  const {navigate} = useNavigation<NavProps['navigation']>();

  const {
    data: originalPost,
    loading: postLoading,
    refetch: postRefetch,
  } = useQuery(GetPostBySubspaceIDandPostID, {
    variables: {
      ID: id,
      subspaceID: sId,
    },
  });

  const {
    data: postComments,
    loading: commentsLoading,
    refetch: commentsRefetch,
  } = useQuery(GetPostComments, {
    variables: {
      postID: id,
      subspaceID: sId,
      limit: 99,
      offset: 0,
    },
  });

  const {data: postReactions, refetch: reactionsRefetch} = useQuery(
    GetPostReactions,
    {
      variables: {
        postID: id,
        subspaceID: sId,
        limit: 99,
        offset: 0,
      },
    },
  );

  const post = React.useMemo(() => {
    if (!originalPost) return {};
    return originalPost.posts[0];
  }, [originalPost]);

  const comments = useMemo(() => {
    if (!postComments) return [];
    return postComments.post;
  }, [postComments]);

  const reactions = useMemo(() => {
    if (!postReactions) return [];
    return postReactions.reaction;
  }, [postReactions]);

  const formattedDate = useMemo(
    () =>
      utcToZonedTime(
        post?.creation_date,
        settings.currentTimezone,
      ).toDateString(),
    [post?.creation_date, settings.currentTimezone],
  );

  const handlePressSelectedComment = React.useCallback(
    ({
      postId,
      commentId,
      subspaceId,
    }: {
      postId: number;
      commentId: number;
      subspaceId: number;
    }) => {
      navigate(ROUTES.COMMENT_REPLIES, {
        postId,
        commentId,
        subspaceId,
      });
    },
    [],
  );

  const handleExpandComment = React.useCallback(
    ({author, postId}: {author: PostAuthor; postId: string}) => {
      navigate(ROUTES.ENTER_COMMENT, {
        author,
        postId,
      });
    },
    [],
  );

  const handlePressSendTips = React.useCallback(() => {
    navigate(ROUTES.SEND_TIPS);
  }, []);

  const handlePressCounters = React.useCallback(() => {
    navigate(ROUTES.POST_INTERACTION, {
      screen: ROUTES.POST_REACTIONS,
      params: {
        expandOnOpen: true,
        allowPanning: true,
        postId: id,
        subspaceId: sId,
      },
    });
  }, []);

  return {
    post,
    postLoading,
    postRefetch,
    comments,
    commentsLoading,
    commentsRefetch,
    reactions,
    reactionsRefetch,
    formattedDate,
    handlePressSelectedComment,
    handleExpandComment,
    handlePressSendTips,
    handlePressCounters,
  };
};

export default useHooks;
