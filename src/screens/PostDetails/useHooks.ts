import {useQuery} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';
import ROUTES from 'navigation/routes';
import React, {useMemo} from 'react';
import {NavProps} from 'screens/PostDetails/index';
import {GetPostComments} from 'services/graphql/queries/GetComments';
import GetPostBySubspaceIDandPostID from 'services/graphql/queries/GetPostBySubspaceIDandPostID';
import GetPostReactions from 'services/graphql/queries/GetReactions';
import useFormatTimeForPostDetails from 'hooks/useFormatTimeForPostDetails';
import useCreatePost from 'services/axios/requests/CentralizedBroadcastTx/CreatePost/useCreatePost';
import {
  Media,
  PostReference,
  PostReferenceType,
} from '@desmoslabs/desmjs-types/desmos/posts/v2/models';
import Long from 'long';
import {useRecoilValue, useResetRecoilState} from 'recoil';
import sharedPostState from '@recoil/sharedPostState';
import UploadMedia from 'services/axios/requests/UploadMedia';
import {mediaToAny} from '@desmoslabs/desmjs/build/aminomessages/posts';
import {useToast} from 'react-native-toast-notifications';
import ToastConfig from 'config/ToastConfig';
import {useTranslation} from 'react-i18next';

const useHooks = ({
  postID,
  subspaceID,
}: {
  postID: number;
  subspaceID: number;
}) => {
  const {navigate} = useNavigation<NavProps['navigation']>();

  const {createPost} = useCreatePost();

  const [postCommentLoading, setPostCommentLoading] = React.useState(false);

  const sharedCommentState = useRecoilValue(sharedPostState);
  const resetSharedPostState = useResetRecoilState(sharedPostState);
  const toast = useToast();

  const {t} = useTranslation();

  const {
    data: originalPost,
    loading: postLoading,
    refetch: postRefetch,
  } = useQuery(GetPostBySubspaceIDandPostID, {
    variables: {
      postID,
      subspaceID,
    },
  });

  const {
    data: postComments,
    loading: commentsLoading,
    refetch: commentsRefetch,
  } = useQuery(GetPostComments, {
    variables: {
      postID,
      subspaceID,
    },
  });

  const {
    data: postReactions,
    loading: reactionsLoading,
    refetch: reactionsRefetch,
  } = useQuery(GetPostReactions, {
    variables: {
      postID,
      subspaceID,
    },
  });

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

  const pageRefetch = async () => {
    await postRefetch({
      postID,
      subspaceID,
    });
    await commentsRefetch({
      postID,
      subspaceID,
    });
    await reactionsRefetch({
      postID,
      subspaceID,
    });
  };

  const formattedDate = useFormatTimeForPostDetails(post?.creation_date);

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
    ({author, postId}: {author: PostAuthor; postId: number}) => {
      navigate(ROUTES.ENTER_COMMENT, {
        author,
        postId,
      });
    },
    [],
  );

  const handlePostComment = React.useCallback(async () => {
    setPostCommentLoading(true);

    try {
      const {postText, postAttachments} = sharedCommentState;

      const attachments = [];
      if (postAttachments && 'uri' in postAttachments) {
        const uploadResponse = await UploadMedia({
          mediaFile: postAttachments,
        });

        const {url} = uploadResponse!;

        const {type} = postAttachments;

        const mediaAny = mediaToAny(
          Media.fromPartial({
            uri: url,
            mimeType: type,
          }),
        );

        attachments.push(mediaAny);
      }

      await createPost({
        text: postText,
        conversationId: Long.fromNumber(postID),
        attachments,
        referencedPosts: [
          PostReference.fromPartial({
            type: PostReferenceType.POST_REFERENCE_TYPE_REPLY,
            postId: Long.fromNumber(postID),
          }),
        ],
      });
    } catch (err: any) {
      if (err.toString().includes('413')) {
        toast.show(t('error:imageTooLarge'), {
          type: ToastConfig.ERROR_NO_RETRY,
        });
      }
    } finally {
      setPostCommentLoading(false);
      resetSharedPostState();
    }
  }, [sharedCommentState]);

  React.useEffect(() => {
    resetSharedPostState();
  }, []);

  const navigateToProfile = React.useCallback(() => {
    navigate(ROUTES.USER_PROFILE, {
      visitingProfileAddress: post?.author.address,
    });
  }, []);

  const handlePressSendTips = React.useCallback(() => {
    navigate(ROUTES.SEND_TIPS);
  }, []);

  const handlePressCounters = React.useCallback(() => {
    navigate(ROUTES.POST_INTERACTION, {
      screen: ROUTES.POST_REACTIONS,
      params: {
        expandOnOpen: true,
        allowPanning: true,
        postId: postID,
        subspaceId: subspaceID,
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
    reactionsLoading,
    reactionsRefetch,
    formattedDate,
    handlePressSelectedComment,
    handleExpandComment,
    handlePressSendTips,
    handlePressCounters,
    navigateToProfile,
    handlePostComment,
    postCommentLoading,
    pageRefetch,
  };
};

export default useHooks;
