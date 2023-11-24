import { MsgCreateReport } from '@desmoslabs/desmjs-types/desmos/reports/v1/msgs';
import {
  MsgCreateReportEncodeObject,
  postTargetToAny,
} from '@desmoslabs/desmjs/build/modules/reports/v1';
import { useActiveAccountAddress } from '@recoil/accounts';
import { useAppStateValue } from '@recoil/appState';
import useHasReportedPost from 'hooks/reports/useHasReportedPost';
import useBroadcastTx, { SuccessfulBroadcast } from 'hooks/transactions/useBroadcastTx';
import { GrantEnums } from 'lib/DesmosUtils/msgtypes';
import Long from 'long';
import { err, Result } from 'neverthrow';
import React from 'react';
import { PostAlreadyReportedError } from 'types/error';
import { Post } from 'types/posts';

/**
 * Hook that allows to report the given post for a given reason and with an optional message.
 * @param post {Post} - Post to be reported.
 */
const useReportPost = (post: Post) => {
  const activeAddress = useActiveAccountAddress();
  if (!activeAddress) {
    throw new Error('Trying to report a post without an active account');
  }

  const subspaceId = useAppStateValue('subspaceId');
  const hasReportedPost = useHasReportedPost();
  const broadcastTx = useBroadcastTx();

  return React.useCallback(
    async (message: string, reasonsIds: number[]): Promise<Result<SuccessfulBroadcast, Error>> => {
      const isReported = await hasReportedPost(post.subspaceId, post.id);
      if (isReported) {
        return err(new PostAlreadyReportedError());
      }

      // Create the message
      const msg: MsgCreateReportEncodeObject = {
        typeUrl: GrantEnums.MsgCreateReport,
        value: MsgCreateReport.fromPartial({
          subspaceId: Long.fromNumber(subspaceId),
          target: postTargetToAny({
            postId: Long.fromNumber(post.id),
          }),
          reasonsIds,
          message: message || '',
          reporter: activeAddress,
        }),
      };

      // Broadcast the transaction
      return broadcastTx([msg]);
    },
    [activeAddress, broadcastTx, hasReportedPost, post.id, post.subspaceId],
  );
};

export default useReportPost;
