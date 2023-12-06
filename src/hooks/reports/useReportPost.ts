import { MsgCreateReport } from '@desmoslabs/desmjs-types/desmos/reports/v1/msgs';
import { Reports } from '@desmoslabs/desmjs';
import { useActiveAccountAddress } from '@recoil/accounts';
import { useAppStateValue } from '@recoil/appState';
import useHasReportedPost from 'hooks/reports/useHasReportedPost';
import { GrantEnums } from 'lib/DesmosUtils/msgtypes';
import Long from 'long';
import { err, ok, Result } from 'neverthrow';
import React from 'react';
import { PostAlreadyReportedError } from 'types/error';
import { Post } from 'types/posts';
import { useSignAndBroadcastTx } from 'hooks/tx/useSignAndBroadcastTx';
import { useTranslation } from 'react-i18next';

/**
 * Hook that allows to report the given post for a given reason and with an optional message.
 * @param post {Post} - Post to be reported.
 */
const useReportPost = (post: Post) => {
  const { t } = useTranslation('reportPost');
  const activeAddress = useActiveAccountAddress();

  const subspaceId = useAppStateValue('subspaceId');
  const hasReportedPost = useHasReportedPost();

  const signAndBroadcastTx = useSignAndBroadcastTx();

  return React.useCallback(
    async (message: string, reasonsIds: number[]): Promise<Result<void, Error>> => {
      if (!activeAddress) {
        return err(new Error('Trying to report a post without an active account'));
      }

      // Check to make sure the post has not already been reported by the same user
      const isReported = await hasReportedPost(post.subspaceId, post.id);
      if (isReported) {
        return err(new PostAlreadyReportedError());
      }

      // Create the message
      const msg: Reports.v1.MsgCreateReportEncodeObject = {
        typeUrl: GrantEnums.MsgCreateReport,
        value: MsgCreateReport.fromPartial({
          subspaceId: Long.fromNumber(subspaceId),
          target: Reports.v1.postTargetToAny({
            postId: Long.fromNumber(post.id),
          }),
          reasonsIds,
          message: message || '',
          reporter: activeAddress,
        }),
      };

      await signAndBroadcastTx([msg], {
        onLoading: {
          popup: {
            title: t('creating report title'),
            description: t('creating report body'),
          },
        },
        onSuccess: {
          popup: {
            title: t('report created title'),
            description: t('report created body'),
          },
        },
      });

      return ok(undefined);
    },
    [activeAddress, hasReportedPost, post.id, post.subspaceId, t],
  );
};

export default useReportPost;
