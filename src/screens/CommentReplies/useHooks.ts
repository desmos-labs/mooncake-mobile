import {useQuery} from '@apollo/client';
import React, {useMemo} from 'react';
import {GetCommentReplies} from 'services/graphql/queries/GetComments';
import GetPostBySubspaceIDandPostID from 'services/graphql/queries/GetPostBySubspaceIDandPostID';
import GetPostReactions from 'services/graphql/queries/GetReactions';

const useHooks = ({
  subspaceID,
  commentID,
}: {
  subspaceID: number;
  commentID: number;
}) => {
  const {
    data: originalComment,
    loading: mainCommentLoading,
    refetch: mainCommentRefetch,
  } = useQuery(GetPostBySubspaceIDandPostID, {
    variables: {
      ID: commentID,
      subspaceID,
    },
  });

  const {data: commentReplies, loading: commentsLoading} = useQuery(
    GetCommentReplies,
    {
      variables: {
        postID: commentID,
        subspaceID,
        limit: 99,
        offset: 0,
      },
    },
  );

  const {data: commentReactions} = useQuery(GetPostReactions, {
    variables: {
      postID: commentID,
      subspaceID,
      limit: 99,
      offset: 0,
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

  /*  useEffect(() => {
    console.log('MAINCOMMENT', mainComment);
    console.log('MAINCOMMENT_COMMENTS', comments);
    console.log('MAINCOMMENT_REACTIONS', reactions);
  }, [mainComment, comments, originalComment]); */

  return {
    mainComment,
    mainCommentLoading,
    mainCommentRefetch,
    comments,
    commentsLoading,
    reactions,
  };
};

export default useHooks;
