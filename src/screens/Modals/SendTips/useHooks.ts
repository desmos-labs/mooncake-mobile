import appSettingsState from '@recoil/settings';
import {useCallback, useMemo} from 'react';
import {useQuery} from '@apollo/client';
import {convertCoin} from '@desmoslabs/desmjs';
import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import useActiveAccount from 'hooks/useActiveAccount';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {useTranslation} from 'react-i18next';
import {useRecoilState} from 'recoil';
import useSendTip from 'services/axios/requests/CentralizedBroadcastTx/useSendTip';
import getAccountBalance from 'services/graphql/queries/GetAccountBalance';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SEND_TIPS>;

const useHooks = () => {
  const [settings] = useRecoilState(appSettingsState);
  const {activeAddress} = useActiveAccount();
  const {sendTip, sendTipLoading} = useSendTip();
  const {goBack, pop} = useNavigation<NavProps['navigation']>();
  const {t} = useTranslation('sendTips');
  const {refetch, loading, data} = useQuery(getAccountBalance, {
    variables: {address: activeAddress},
  });

  const editable = useMemo(() => {
    return !(loading || data.action_account_balance.coins[0].amount <= 0);
  }, [data, loading]);

  const handleSendTip = async ({
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
    await sendTip({amount, postId, sender, receiver, message: ''});
    pop();
  };

  const convertedBalance = useMemo(() => {
    if (data && !loading) {
      return convertCoin(
        data?.action_account_balance?.coins[0],
        6,
        settings.currentChain.currencies,
      );
    }
  }, [data, loading, settings]);

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
    settings,
  };
};

export default useHooks;
