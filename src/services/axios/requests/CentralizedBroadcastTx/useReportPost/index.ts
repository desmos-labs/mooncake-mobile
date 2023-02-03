import React from 'react';
import { GrantEnums } from 'lib/DesmosUtils/msgtypes';
import ToastConfig from 'config/ToastConfig';
import useCheckAndUpdateGrants from 'hooks/authGrants/useCheckAndUpdateGrants';
import { useToast } from 'react-native-toast-notifications';
import useActiveAccount from 'hooks/useActiveAccount';
import { MsgCreateReportEncodeObject } from '@desmoslabs/desmjs';
import { MsgCreateReport } from '@desmoslabs/desmjs-types/desmos/reports/v1/msgs';
import EnvConfig from 'config/EnvConfig';
import { convertPostTargetToAny } from '@desmoslabs/desmjs/build/aminomessages/reports';
import { PostTarget } from '@desmoslabs/desmjs-types/desmos/reports/v1/models';
import Long from 'long';
import { encodeAndBroadcastTx } from 'services/axios/requests/CentralizedBroadcastTx';

interface ReportPostArgs {
  postId: number;
  message: string;
  reasonId: number;
}

const useReportPost = () => {
  const { checkAndUpdateGrants } = useCheckAndUpdateGrants();
  const toast = useToast();
  const { activeAddress } = useActiveAccount();

  const [loading, setLoading] = React.useState(false);

  const reportPost = React.useCallback(
    async ({ postId, message, reasonId }: ReportPostArgs) => {
      const grantsToRequest: GrantEnums[] = [GrantEnums.MsgCreateReport];
      // check if user has grants first
      const { success } = await checkAndUpdateGrants({
        grantsToRequest,
      });

      if (!success) {
        return toast.show('[PLACEHOLDER]Authorization is required.', {
          type: ToastConfig.ERROR_NO_RETRY,
        });
      }

      setLoading(true);
      try {
        const msg: MsgCreateReportEncodeObject = {
          typeUrl: GrantEnums.MsgCreateReport,
          value: MsgCreateReport.fromPartial({
            subspaceId: EnvConfig.APP_SUBSPACE_ID,
            target: convertPostTargetToAny(
              PostTarget.fromPartial({
                postId: Long.fromNumber(postId),
              }),
            ),
            reasonsIds: [reasonId],
            message: message || '',
            reporter: activeAddress,
          }),
        };
        const result = await encodeAndBroadcastTx({ msgs: [msg] });
        console.log('useReportPost', result);
        return result;
      } catch (err) {
        console.log('useReportPost', String(err));
        toast.show(String(err), {
          type: ToastConfig.ERROR_NO_RETRY,
        });
      } finally {
        setLoading(false);
      }
    },
    [activeAddress],
  );

  return {
    reportPost,
    loading,
  };
};

export default useReportPost;
