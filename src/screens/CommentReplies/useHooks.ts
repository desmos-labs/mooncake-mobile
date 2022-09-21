import {useQuery} from '@apollo/client';
import {
  Media,
  PostReference,
  PostReferenceType,
} from '@desmoslabs/desmjs-types/desmos/posts/v2/models';
import {useNavigation} from '@react-navigation/native';
import sharedPostState from '@recoil/sharedPostState';
import Long from 'long';
import ROUTES from 'navigation/routes';
import React, {useMemo} from 'react';
import {useRecoilValue, useResetRecoilState} from 'recoil';
import {NavProps} from 'screens/CommentReplies/index';
import useCreatePost from 'services/axios/requests/CentralizedBroadcastTx/CreatePost/useCreatePost';
import {GetCommentReplies} from 'services/graphql/queries/GetComments';
import GetPostBySubspaceIDandPostID from 'services/graphql/queries/GetPostBySubspaceIDandPostID';
import GetPostReactions from 'services/graphql/queries/GetReactions';
import UploadMedia from 'services/axios/requests/UploadMedia';
import {mediaToAny} from '@desmoslabs/desmjs/build/aminomessages/posts';
import ToastConfig from 'config/ToastConfig';
import {useToast} from 'react-native-toast-notifications';
import {useTranslation} from 'react-i18next';

const useHooks = ({
  subspaceID,
  commentID,
}: {
  subspaceID: number;
  commentID: number;
}) => {
  const {createPost} = useCreatePost();
  const [commentReplyLoading, setCommentReplyLoading] = React.useState(false);
  const resetSharedPostState = useResetRecoilState(sharedPostState);
  const sharedCommentState = useRecoilValue(sharedPostState);
  const {navigate} = useNavigation<NavProps['navigation']>();
  const toast = useToast();

  const {t} = useTranslation();

  const {
    data: originalComment,
    loading: mainCommentLoading,
    refetch: mainCommentRefetch,
  } = useQuery(GetPostBySubspaceIDandPostID, {
    variables: {
      postID: commentID,
      subspaceID,
    },
    fetchPolicy: 'no-cache',
  });

  const {
    data: commentReplies,
    loading: commentsLoading,
    refetch: commentsRefetch,
  } = useQuery(GetCommentReplies, {
    variables: {
      postID: commentID,
      subspaceID,
    },
    fetchPolicy: 'no-cache',
  });

  const {
    data: commentReactions,
    loading: reactionsLoading,
    refetch: reactionsRefetch,
  } = useQuery(GetPostReactions, {
    variables: {
      postID: commentID,
      subspaceID,
    },
  });

  const mainComment = React.useMemo(() => {
    if (!originalComment) return undefined;
    return originalComment.posts[0];
  }, [originalComment]);

  const comments = useMemo(() => {
    if (!commentReplies) return [];
    return commentReplies.post_reference;
  }, [commentReplies]);

  const reactions = useMemo(() => {
    if (!commentReactions) return [];
    return commentReactions.reaction;
  }, [commentReactions]);

  const pageRefetch = async () => {
    await mainCommentRefetch({
      postID: commentID,
      subspaceID,
    });
    await commentsRefetch({
      postID: commentID,
      subspaceID,
    });
    await reactionsRefetch({
      postID: commentID,
      subspaceID,
    });
  };

  const handlePressCounters = React.useCallback(() => {
    navigate(ROUTES.POST_INTERACTION, {
      screen: ROUTES.POST_REACTIONS,
      params: {
        expandOnOpen: true,
        allowPanning: true,
        postId: commentID,
        subspaceId: subspaceID,
      },
    });
  }, []);

  const handleCommentReply = React.useCallback(async () => {
    setCommentReplyLoading(true);

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
        conversationId: Long.fromNumber(commentID),
        attachments,
        referencedPosts: [
          PostReference.fromPartial({
            type: PostReferenceType.POST_REFERENCE_TYPE_REPLY,
            postId: Long.fromNumber(commentID),
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
      setCommentReplyLoading(false);
      resetSharedPostState();
    }
  }, [sharedCommentState]);

  React.useEffect(() => {
    resetSharedPostState();
  }, []);

  const handlePressSendTips = React.useCallback(() => {
    navigate(ROUTES.SEND_TIPS);
  }, []);

  const handleExpandComment = React.useCallback(
    ({author, postId}: {author: PostAuthor; postId: number}) => {
      navigate(ROUTES.ENTER_COMMENT, {
        author,
        postId,
      });
    },
    [],
  );

  return {
    mainComment,
    mainCommentLoading,
    mainCommentRefetch,
    comments,
    commentsLoading,
    commentsRefetch,
    reactions,
    reactionsLoading,
    reactionsRefetch,
    handlePressCounters,
    handlePressSendTips,
    handleExpandComment,
    handleCommentReply,
    commentReplyLoading,
    pageRefetch,
  };
};

export default useHooks;
