import {useQuery} from '@apollo/client';
import {useMemo} from 'react';
import {GetPostReactions} from 'services/graphql/queries/GetReactions';

const useHooks = ({
  postId,
  subspaceId,
}: {
  postId: number;
  subspaceId: number;
}) => {
  const {
    data: postReactions,
    loading: reactionsLoading,
    refetch: reactionsRefetch,
  } = useQuery(GetPostReactions, {
    variables: {
      postID: postId,
      subspaceID: subspaceId,
    },
  });

  const reactions = useMemo(() => {
    if (!postReactions) return [];
    return postReactions.reaction;
  }, [postReactions]);

  return {
    reactions,
    reactionsLoading,
    reactionsRefetch,
  };
};

export default useHooks;
