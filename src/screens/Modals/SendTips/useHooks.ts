import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import ToastConfig from 'config/ToastConfig';
import useCheckAndUpdateGrants from 'hooks/authGrants/useCheckAndUpdateGrants';
import {GrantEnums} from 'lib/desmos/msgtypes';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import {useToast} from 'react-native-toast-notifications';
import useSendTip from 'services/axios/requests/CentralizedBroadcastTx/SendTip/useSendTip';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SEND_TIPS>;

const useHooks = () => {
  const {checkAndUpdateGrants} = useCheckAndUpdateGrants();
  const {manageTips, sendTipLoading} = useSendTip();
  const {pop, goBack} = useNavigation<NavProps['navigation']>();
  const toast = useToast();

  const handleSendTip = React.useCallback(
    async ({
      amount,
      sender,
      receiver,
      postId,
    }: {
      amount: number;
      sender: string;
      receiver: string;
      postId: number;
    }) => {
      const grantsToRequest: GrantEnums[] = [GrantEnums.MsgExecuteContract];
      const {success} = await checkAndUpdateGrants({
        grantsToRequest,
        address: sender,
      });

      if (success) {
        await manageTips({
          amount,
          postId,
          sender,
          receiver,
          message: '',
        });
        pop();
      } else {
        toast.show('[PLACEHOLDER]Authorization is required.', {
          type: ToastConfig.ERROR_NO_RETRY,
        });
      }
    },
    [],
  );

  return {
    handleSendTip,
    sendTipLoading,
    goBack,
  };
};

export default useHooks;
