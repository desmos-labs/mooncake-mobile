import {useQuery} from '@apollo/client';
import {useMemo} from 'react';
import {GetPostTips} from 'services/graphql/queries/GetPostTips';

const useHooks = ({
  postId,
  subspaceId,
}: {
  postId: number;
  subspaceId: number;
}) => {
  const {
    data: postTips,
    loading: tipsLoading,
    refetch: tipsRefetch,
  } = useQuery(GetPostTips, {
    variables: {
      postID: postId,
      subspaceID: subspaceId,
    },
  });

  const tips = useMemo(() => {
    if (!postTips) return [];
    return postTips.tip_post;
  }, [postTips]);

  return {
    tips,
    tipsLoading,
    tipsRefetch,
  };
};

export default useHooks;
