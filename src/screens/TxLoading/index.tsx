import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EncodeObject } from '@cosmjs/proto-signing';
import { DeliverTxResponse } from '@desmoslabs/desmjs';
import { View } from 'react-native';
import { StdFee } from '@cosmjs/amino';
import { Image } from 'expo-image';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Typography from 'components/Typography';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { errorImage } from 'assets/images';
import ROUTES from 'navigation/routes';
import { useEstimateFees, useSignAndBroadcastTx } from 'hooks/tx/useSignAndBroadcastTx';
import { loadingYellow } from 'assets/animations';
import Spacer from 'components/Spacer';
import { AccountWithWallet } from 'types/account';
import useParseErrorMessage from 'hooks/useParseErrorMessage';
import Button from 'components/Button';
import { useTheme } from 'native-base';
import ThemedLottieView from 'components/ThemedLottieView';
import DView from 'components/DView';
import useStyles from './useStyles';

export interface TxLoadingParams {
  accountOrAddress: AccountWithWallet | string;
  messages: EncodeObject[];
  feeGranter?: string;
  customHeader?: string;
  customBody?: string;
  customAnimation?: LottieAnimation;
  onCancel?: () => any;
  onSuccess?: (tx: DeliverTxResponse) => any;
  onError?: (e: Error) => any;
  onErrorButtonText?: string;
  onErrorButtonAction?: () => any;
}

export type NavProps = NativeStackScreenProps<RootNavigatorParamList, ROUTES.TX_LOADING>;

/**
 * Screen that is shown to the user while a transaction is being broadcast.
 * @constructor
 */
const TxLoading = () => {
  const { goBack } = useNavigation<NavProps['navigation']>();
  const { params } = useRoute<NavProps['route']>();
  const { t } = useTranslation('transaction');
  const styles = useStyles();
  const theme = useTheme();
  const isAccount = typeof params.accountOrAddress !== 'string';
  const { estimateFees, estimatingFees } = useEstimateFees(
    isAccount ? params.accountOrAddress.account : undefined,
  );
  const [broadcasting, setBroadcasting] = useState(false);
  const [canBroadcast, setCanBroadcast] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const signAndBroadcastTx = useSignAndBroadcastTx();
  const parseError = useParseErrorMessage();

  const broadcast = useCallback(
    async (estimatedFees: StdFee) => {
      setBroadcasting(true);
      const result = await signAndBroadcastTx(
        params.accountOrAddress,
        params.messages,
        estimatedFees,
        params.feeGranter,
      );
      setBroadcasting(false);

      if (result.isOk() && result.value && params.onSuccess) {
        params.onSuccess(result.value);
      }

      if (result.isErr() && result.error && params.onError) {
        const parsedError = parseError(result.error.message);
        setError(parsedError);
        params.onError(new Error(parsedError));
      }
    },
    [params, parseError, signAndBroadcastTx],
  );

  const estimateFeesAndBroadcast = useCallback(async () => {
    if (!canBroadcast) return;
    const estimatedFees = await estimateFees(params.messages, { feeGranter: params.feeGranter });
    if (estimatedFees) {
      setCanBroadcast(false);
      await broadcast(estimatedFees);
    }
  }, [broadcast, canBroadcast, estimateFees, params.feeGranter, params.messages]);

  useEffect(() => {
    estimateFeesAndBroadcast();
  }, [estimateFeesAndBroadcast]);

  const onErrorPress = useCallback(() => {
    params.onErrorButtonAction ? params.onErrorButtonAction() : goBack();
  }, [goBack, params]);

  return (
    <DView style={styles.root}>
      <View style={styles.innerContainer}>
        {error ? (
          <Image source={errorImage} style={styles.animation} />
        ) : (
          <ThemedLottieView
            source={params.customAnimation ?? loadingYellow}
            loop={true}
            autoPlay={true}
            style={styles.animation}
          />
        )}
        <Typography.H6>
          {error ? t('oops', { ns: 'common' }) : params.customHeader ?? t('broadcasting tx header')}
        </Typography.H6>
        <Spacer paddingBottom={theme.spacing.s} />
        <Typography.Body1 style={styles.bodyText}>
          {error ?? params.customBody ?? t('broadcasting tx body')}
        </Typography.Body1>
        <Spacer paddingBottom={theme.spacing.s} />
        {estimatingFees && <Typography.Body1>{t('estimating fees')}</Typography.Body1>}
        {error && (
          <Spacer paddingVertical="m">
            <Button height={44} onPress={onErrorPress}>
              {params.onErrorButtonText ?? t('go back', { ns: 'common' })}
            </Button>
          </Spacer>
        )}
        <Spacer paddingBottom={theme.spacing.s} />
        {broadcasting && <Typography.Body1>{t('broadcasting tx loading')}</Typography.Body1>}
      </View>
    </DView>
  );
};

export default TxLoading;
