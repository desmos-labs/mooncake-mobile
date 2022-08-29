import {useQuery} from '@apollo/client';
import appSettingsState from '@recoil/settings';
import {utcToZonedTime} from 'date-fns-tz';
import React, {useEffect, useMemo} from 'react';
import {useRecoilState} from 'recoil';
import {GetPostComments} from 'services/graphql/queries/GetComments';
import GetPostBySubspaceIDandPostID from 'services/graphql/queries/GetPostBySubspaceIDandPostID';
import GetPostReactions from 'services/graphql/queries/GetReactions';

const useHooks = ({id, sId}: {id: number; sId: number}) => {
  const [settings] = useRecoilState(appSettingsState);

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

  const {data: postComments, loading: commentsLoading} = useQuery(
    GetPostComments,
    {
      variables: {
        postID: id,
        subspaceID: sId,
        limit: 99,
        offset: 0,
      },
    },
  );

  const {data: postReactions} = useQuery(GetPostReactions, {
    variables: {
      postID: id,
      subspaceID: sId,
      limit: 99,
      offset: 0,
    },
  });

  const post = React.useMemo(() => {
    if (!originalPost) return undefined;
    return originalPost.posts[0];
  }, [originalPost]);

  const comments = useMemo(() => {
    if (!postComments) return [];
    return postComments.post;
  }, [postComments]);

  const reactions = useMemo(() => {
    console.log('reactionsToFilter', postReactions?.length);
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

  useEffect(() => {
    /*    console.log('ID', id);
    console.log('subspaceID', sId);
    console.log('POST', post);
    console.log('COMMENTS', comments);
    console.log('REACTIONS', reactions); */
  }, [post, comments, postReactions]);

  return {
    post,
    postLoading,
    postRefetch,
    comments,
    commentsLoading,
    reactions,
    formattedDate,
  };
};

export default useHooks;
