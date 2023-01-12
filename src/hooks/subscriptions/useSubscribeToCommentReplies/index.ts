import {useSubscription} from '@apollo/client';
import EnvConfig from 'config/EnvConfig';
import {useEffect, useRef} from 'react';
import CommentRepliesAggregateSubscription from 'services/graphql/subscriptions/CommentRepliesAggregateSubscription';

type Props = {
  /**
   * The ID of the post comment
   */
  commentID: number;

  /**
   * What to do if a change in the number of comments is detected.
   */
  updateAction: () => void;
};

const useSubscribeToCommentReplies = ({commentID, updateAction}: Props) => {
  const savedCount = useRef<number>(0);

  const {data} = useSubscription(CommentRepliesAggregateSubscription, {
    variables: {
      subspaceID: EnvConfig.APP_SUBSPACE_ID,
      commentID,
    },
  });

  useEffect(() => {
    if (!data) return;

    const {
      post_aggregate: {
        aggregate: {count},
      },
    } = data;

    if (savedCount.current !== count) {
      savedCount.current = count;
      updateAction();
    }
  }, [JSON.stringify(data), savedCount.current, updateAction]);
};

export default useSubscribeToCommentReplies;
