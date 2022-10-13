import {useQuery} from '@apollo/client';
import {convertCoin} from '@desmoslabs/desmjs';
import {MorpheusApollo2} from '@desmoslabs/desmjs/build/types/chains';
import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import ToastConfig from 'config/ToastConfig';
import useCheckAndUpdateGrants from 'hooks/authGrants/useCheckAndUpdateGrants';
import useActiveAccount from 'hooks/useActiveAccount';
import {GrantEnums} from 'lib/desmos/msgtypes';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {useToast} from 'react-native-toast-notifications';
import useSendTip from 'services/axios/requests/CentralizedBroadcastTx/SendTip/useSendTip';
import getAccountBalance from 'services/graphql/queries/GetAccountBalance';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SEND_TIPS>;

const useHooks = () => {
  const {activeAddress} = useActiveAccount();
  const {checkAndUpdateGrants} = useCheckAndUpdateGrants();
  const {manageTips, sendTipLoading} = useSendTip();
  const {pop, goBack} = useNavigation<NavProps['navigation']>();
  const toast = useToast();
  const {t} = useTranslation('sendTips');
  const {refetch, loading, data} = useQuery(getAccountBalance, {
    variables: {address: activeAddress},
  });

  const editable = useMemo(() => {
    return !(loading || data.action_account_balance.coins[0].amount <= 0);
  }, [data, loading]);

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
    [checkAndUpdateGrants, manageTips, toast],
  );

  const convertedBalance = useMemo(() => {
    if (data && !loading) {
      return convertCoin(
        data?.action_account_balance?.coins[0],
        6,
        MorpheusApollo2.denomUnits,
      );
    }
  }, [data, loading]);

  const initialFormValues = {
    amount: '',
  };

  const validateForm = useCallback(
    (values: typeof initialFormValues) => {
      const errors: any = {};
      if (convertedBalance?.amount) {
        if (parseFloat(values.amount) < 0.1) {
          errors.amount = t('too few');
        } else if (
          parseFloat(values.amount) >
          parseInt(convertedBalance.amount, 10) * 0.9
        ) {
          errors.amount = t('too much');
        }
      }

      return errors;
    },
    [convertedBalance],
  );

  return {
    activeAddress,
    refetch,
    loading,
    editable,
    handleSendTip,
    sendTipLoading,
    goBack,
    initialFormValues,
    validateForm,
    convertedBalance,
  };
};

export default useHooks;
