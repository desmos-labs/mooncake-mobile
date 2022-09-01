import {useQuery} from '@apollo/client';
import appSettingsState from '@recoil/settings';
import {utcToZonedTime} from 'date-fns-tz';
import React, {useMemo} from 'react';
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
    console.log(originalPost);
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
