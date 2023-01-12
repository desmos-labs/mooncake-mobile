import {useSubscription} from '@apollo/client';
import EnvConfig from 'config/EnvConfig';
import {useCallback, useRef} from 'react';
import PostCommentsAggregateSubscription from 'services/graphql/subscriptions/PostCommentsAggregateSubscription';
import {OnDataOptions} from '@apollo/client/react/types/types';
import _ from 'lodash';

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

  const onData = useCallback(
    (options: OnDataOptions) => {
      const count = _.get(
        options,
        'data.data.post_aggregate.aggregate.count',
        0,
      );
      if (savedCount && savedCount.current !== count) {
        savedCount.current = count;
        updateAction();
      }
    },
    [savedCount.current, updateAction],
  );

  useSubscription(PostCommentsAggregateSubscription, {
    variables: {
      subspaceID: EnvConfig.APP_SUBSPACE_ID,
      postID,
    },
    onData,
  });
};

export default useSubscribeToPostComments;
