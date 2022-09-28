import {DesmosClient, MsgCreateReportEncodeObject} from '@desmoslabs/desmjs';
import {PostTarget} from '@desmoslabs/desmjs-types/desmos/reports/v1/models';
import {MsgCreateReport} from '@desmoslabs/desmjs-types/desmos/reports/v1/msgs';
import {convertPostTargetToAny} from '@desmoslabs/desmjs/build/aminomessages/reports';
import EnvConfig from 'config/EnvConfig';
import useActiveAccount from 'hooks/useActiveAccount';
import Long from 'long';
import React, {useCallback} from 'react';
import CentralizedBroadcastTx from 'services/axios/requests/CentralizedBroadcastTx';

/**
 * Hook that manange a reaction, adding or removing it.
 */
const useReportPost = () => {
  const {activeAddress} = useActiveAccount();
  const [reportPostLoading, setReportPostLoading] = React.useState(false);

  const reportPost = React.useCallback(
    async ({
      postId,
      user,
      reasonsIds,
      message,
    }: {
      postId: number;
      user: string;
      reasonsIds: number[];
      message?: string;
    }) => {
      if (!activeAddress) return;

      try {
        const client = await DesmosClient.connect(EnvConfig.DESMOS_RPC);
        const msg: MsgCreateReportEncodeObject = {
          typeUrl: '/desmos.reports.v1.MsgCreateReport',
          value: MsgCreateReport.fromPartial({
            subspaceId: EnvConfig.APP_SUBSPACE_ID,
            target: convertPostTargetToAny(
              PostTarget.fromPartial({
                postId: Long.fromNumber(postId),
              }),
            ),
            reasonsIds,
            message: message || '',
            reporter: user,
          }),
        };

        const aminoEncodedMsg = client.encodeToAmino([msg]);

        return await CentralizedBroadcastTx({
          messages: aminoEncodedMsg,
        });
      } catch (err: any) {
        throw new Error(err.toString());
      }
    },
    [activeAddress],
  );

  /**
   * @param {number} postId The ID of the post
   * @param {string} user The address of the user managing the report
   * @param {number[]} reasonsIds IDs of the reasons related to the report
   * @param {string} message Optional message
   * */
  const manageReport = useCallback(
    async ({
      postId,
      user,
      reasonsIds,
      message,
    }: {
      postId: number;
      user: string;
      reasonsIds: number[];
      message?: string;
    }) => {
      setReportPostLoading(true);
      let result;
      try {
        result = await reportPost({postId, user, reasonsIds, message});
      } catch (err: any) {
        throw new Error(err.toString());
      } finally {
        setReportPostLoading(false);
        console.log(result);
      }
    },
    [],
  );

  return {manageReport, reportPostLoading};
};

export default useReportPost;
