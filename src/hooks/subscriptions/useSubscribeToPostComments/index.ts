import {useSubscription} from '@apollo/client';
import EnvConfig from 'config/EnvConfig';
import {useEffect, useRef} from 'react';
import PostCommentsAggregateSubscription from 'services/graphql/subscriptions/PostCommentsAggregateSubscription';

type Props = {
  /**
   * The postID to subscribe to comments for
   */
  postID: number;

  /**
   * What to do if a change in the number of comments is detected.
   */
  updateAction: () => void;
};

const useSubscribeToPostComments = ({postID, updateAction}: Props) => {
  const savedCount = useRef<number>(0);

  const {data} = useSubscription(PostCommentsAggregateSubscription, {
    variables: {
      subspaceID: EnvConfig.APP_SUBSPACE_ID,
      postID,
    },
  });

  useEffect(() => {
    console.log('hello world', data);
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

export default useSubscribeToPostComments;
