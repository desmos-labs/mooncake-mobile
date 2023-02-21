import { StackScreenProps } from '@react-navigation/stack';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import ThemedLottieView from 'components/ThemedLottieView';
import Typography from 'components/Typography';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import ROUTES from 'navigation/routes';
import { useRoute } from '@react-navigation/native';
import { broadcastAnim } from 'assets/animations';
import { DeliverTxResponse, EncodeObject } from '@desmoslabs/desmjs';
import useOnBackAction from 'hooks/navigation/useOnBackAction';
import { useBroadcastTx, useEstimateFees } from 'screens/BroadcastTxOnChain/useHooks';
import { Result } from 'neverthrow';
import { StdFee } from '@cosmjs/amino';
import Button from 'components/Button';
import { isCanceledOperationError } from 'types/error';
import useStyles from './useStyles';

export type BroadcastTxParams = {
  /**
   * Messages to broadcast.
   */
  messages: EncodeObject[];
  /**
   * Address of who is signing the transaction.
   */
  accountAddress: string;
  /**
   * Optional transaction memo.
   */
  memo?: string;
  /**
   * Override screen title.
   */
  title?: string;

  onSuccess?: (txResponse: DeliverTxResponse) => void;
  onCancel?: () => void;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.BROADCAST_TX_ON_CHAIN>;

const BroadcastTxOnChain: React.FC = () => {
  const { t } = useTranslation('broadcastTxOnChain');
  const styles = useStyles();
  const { params } = useRoute<NavProps['route']>();
  const { accountAddress, messages, memo, title, onSuccess, onCancel } = params;
  const estimateFees = useEstimateFees();
  const [estimatingFees, setEstimatingFees] = React.useState(false);
  const [feesResult, setFeesResult] = React.useState<Result<StdFee, Error>>();
  const broadcastTx = useBroadcastTx();
  const [broadcastingTx, setBroadcastingTx] = React.useState(false);

  // Call cancel callback if the use goes back.
  useOnBackAction(() => {
    onCancel && onCancel();
  }, [onCancel]);

  React.useEffect(() => {
    (async () => {
      setFeesResult(undefined);
      setEstimatingFees(true);
      const estimatedFees = await estimateFees(accountAddress, messages, memo);
      setEstimatingFees(false);
      setFeesResult(estimatedFees);
    })();

    // Safe to ignore, we want to estimate the fees just when we enter this screen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBroadcastTx = React.useCallback(async () => {
    if (feesResult?.isOk()) {
      setBroadcastingTx(true);
      const result = await broadcastTx(accountAddress, messages, feesResult.value, memo);
      setBroadcastingTx(false);

      if (result.isErr() && !isCanceledOperationError(result.error)) {
        // TODO: Show this error message in a modal.
        console.error(result.error.message);
      } else if (result.isOk() && onSuccess) {
        onSuccess(result.value);
      }
    }
  }, [accountAddress, broadcastTx, feesResult, memo, messages, onSuccess]);

  return (
    <DView>
      <View style={styles.container}>
        {/* Broadcasting animation shown while the transaction it's broadcasting */}
        {broadcastingTx && (
          <>
            <ThemedLottieView autoSize autoPlay loop source={broadcastAnim} />
            <Spacer paddingVertical={12}>
              <Typography.H4>{title || t('transaction broadcasting')}</Typography.H4>
            </Spacer>
            <Typography.Body6>{t('please wait')}</Typography.Body6>
          </>
        )}
        {/* Messages list, tx fees and memo */}
        {!broadcastingTx && (
          <>
            {/* TODO: Create a proper UI to display the tx messages */}
            <ScrollView style={{ minHeight: '80%', flex: 1 }}>
              <Typography.Body1>{JSON.stringify(messages)}</Typography.Body1>
            </ScrollView>
            {estimatingFees || feesResult === undefined ? (
              /* TODO: Create a proper UI with a spinner or something else */
              <Typography.Body1>Estimating fees...</Typography.Body1>
            ) : (
              /* TODO: Create a proper UI to render the fee result */
              <Typography.Body1>
                Fees:{' '}
                {feesResult.isOk() ? JSON.stringify(feesResult.value) : feesResult.error.message}
              </Typography.Body1>
            )}
            <Typography.Body1>
              {t('memo')}: {memo ?? 'N/A'}
            </Typography.Body1>
          </>
        )}
      </View>
      <Button
        style={{ zIndex: 99 }}
        onPress={handleBroadcastTx}
        loading={broadcastingTx}
        disabled={estimatingFees || feesResult?.isErr() || broadcastingTx}>
        {t('broadcast tx')}
      </Button>
    </DView>
  );
};

export default BroadcastTxOnChain;
