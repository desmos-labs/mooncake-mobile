import React from 'react';
import { GrantEnums } from 'lib/DesmosUtils/msgtypes';
import { MsgCreateReportEncodeObject } from '@desmoslabs/desmjs';
import { MsgCreateReport } from '@desmoslabs/desmjs-types/desmos/reports/v1/msgs';
import EnvConfig from 'config/EnvConfig';
import Long from 'long';
import { Post } from 'types/posts';
import { postTargetToAny } from '@desmoslabs/desmjs/build/aminomessages/reports';
import { useActiveAccountAddress } from '@recoil/accounts';
import useBroadcastTx from 'hooks/useBroadcastTx';

/**
 * Hook that allows to report the given post for a given reason and with an optional message.
 * @param post {Post} - Post to be reported.
 */
const useReportPost = (post: Post) => {
  const activeAddress = useActiveAccountAddress();
  if (!activeAddress) {
    throw new Error('Trying to report a post without an active account');
  }

  const broadcastTx = useBroadcastTx();

  return React.useCallback(
    async (message: string, reasonsIds: number[]) => {
      // Create the message
      const msg: MsgCreateReportEncodeObject = {
        typeUrl: GrantEnums.MsgCreateReport,
        value: MsgCreateReport.fromPartial({
          subspaceId: EnvConfig.APP_SUBSPACE_ID,
          target: postTargetToAny({
            postId: Long.fromNumber(post.id),
          }),
          reasonsIds,
          message: message || '',
          reporter: activeAddress,
        }),
      };

      // Broadcast the transaction
      return broadcastTx([msg], {
        optimistic: true,
      });
    },
    [activeAddress, broadcastTx, post.id],
  );
};

export default useReportPost;
