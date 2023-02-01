import appSettingsState from '@recoil/settings';
import React, {useCallback, useMemo} from 'react';
import {useQuery} from '@apollo/client';
import {convertCoin} from '@desmoslabs/desmjs';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import useActiveAccount from 'hooks/useActiveAccount';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {useTranslation} from 'react-i18next';
import {useRecoilState} from 'recoil';
import useSendTip from 'services/axios/requests/CentralizedBroadcastTx/useSendTip';
import getAccountBalance from 'services/graphql/queries/GetAccountBalanceAndTokenPrice';
import _ from 'lodash';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SEND_TIPS>;

// this will directly control the default tip amount buttons
export const TIP_AMOUNTS = [1, 5, 10];

const useHooks = () => {
  const {params} = useRoute<NavProps['route']>();

  const [settings] = useRecoilState(appSettingsState);
  const {activeAddress} = useActiveAccount();
  const {sendTip, sendTipLoading} = useSendTip();
  const {goBack, pop} = useNavigation<NavProps['navigation']>();
  const {t} = useTranslation('sendTips');
  const {refetch, loading, data} = useQuery(getAccountBalance, {
    variables: {address: activeAddress, tokenName: ''},
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const initialFormValues = {
    amount: '',
  };

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

  const tipFee = useMemo(() => {
    return _.get(
      settings,
      'contractsConfig[0].config.service_fee.percentage.value',
      0,
    );
  }, [settings?.contractsConfig[0]]);

  const tipLimits = useMemo(() => {
    return {
      min: 1 + (1 * tipFee) / 100,
      max: parseFloat(_.get(convertedBalance, 'amount', '0')) * 0.99,
    };
  }, [convertedBalance, tipFee]);

  const validateForm = useCallback(
    (values: typeof initialFormValues) => {
      const errors: any = {};
      if (convertedBalance?.amount) {
        /**
         * Fail minimum validation if entered tip amount is less than 1 or if
         * user has less than the absolute minimum tip amount (1 + tip fee)
         */
        if (
          parseFloat(values.amount) < 1 ||
          parseFloat(convertedBalance.amount) < tipLimits.min
        ) {
          errors.amount = t('too few');
        } else if (parseFloat(values.amount) > tipLimits.max) {
          errors.amount = t('too much');
        }
      }

      return errors;
    },
    [convertedBalance, tipLimits],
  );

  const shouldDisableTipButton: {[index: string]: boolean} =
    React.useMemo(() => {
      const userTokens = _.get(convertedBalance, 'amount', 0);

      return TIP_AMOUNTS.reduce((acc, cur) => {
        return {
          ...acc,
          [cur]: userTokens < cur + cur * (tipFee / 100),
        };
      }, {});
    }, [convertedBalance?.amount, tipFee]);

  const handlePressConfirm = React.useCallback(
    (values: any) => {
      handleSendTip({
        amount: parseInt(values.amount, 10),
        receiver: params.postAuthor,
        sender: activeAddress!,
        postId: params.postId!,
      });
    },
    [handleSendTip, activeAddress],
  );

  return {
    loading,
    editable,
    sendTipLoading,
    goBack,
    initialFormValues,
    validateForm,
    convertedBalance,
    shouldDisableTipButton,
    tipFee,
    handlePressConfirm,
  };
};

export default useHooks;
