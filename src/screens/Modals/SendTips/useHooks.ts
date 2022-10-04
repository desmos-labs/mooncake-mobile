import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import activeProfileState from '@recoil/activeProfileState';
import ToastConfig from 'config/ToastConfig';
import useCheckAndUpdateGrants from 'hooks/authGrants/useCheckAndUpdateGrants';
import {GrantEnums} from 'lib/desmos/msgtypes';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import {useToast} from 'react-native-toast-notifications';
import {useRecoilState} from 'recoil';
import useSendTip from 'services/axios/requests/CentralizedBroadcastTx/SendTip/useSendTip';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SEND_TIPS>;

const useHooks = () => {
  const {checkAndUpdateGrants} = useCheckAndUpdateGrants();
  const {manageTips, sendTipLoading} = useSendTip();
  const {goBack} = useNavigation<NavProps['navigation']>();
  const [profile] = useRecoilState(activeProfileState);
  const toast = useToast();

  const handleSendTip = React.useCallback(
    async ({
      amount,
      sender,
      receiver,
    }: {
      amount: number;
      sender: string;
      receiver: string;
    }) => {
      const grantsToRequest: GrantEnums[] = [GrantEnums.MsgExecuteContract];
      // check if user has grants first
      const {success} = await checkAndUpdateGrants({
        grantsToRequest,
        address: profile?.address!,
      });

      if (success) {
        await manageTips({
          amount: [
            {
              denom: 'udaric',
              amount: (amount * 1000000).toString(),
            },
          ],
          sender,
          receiver,
          message: '',
        });
        goBack();
      } else {
        toast.show('[PLACEHOLDER]Authorization is required.', {
          type: ToastConfig.ERROR_NO_RETRY,
        });
      }
    },
    [profile?.address],
  );

  return {
    handleSendTip,
    sendTipLoading,
    profile,
    goBack,
  };
};

export default useHooks;
