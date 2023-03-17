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
import Button, { ButtonMode, ButtonSize } from 'components/Button';
import { isCanceledOperationError } from 'types/error';
import { Wallet } from 'types/wallet';
import { useTheme } from 'native-base';
import { useToast } from 'react-native-toast-notifications';
import ToastConfig from 'config/ToastConfig';
import useStyles from './useStyles';

export type BroadcastTxParams = {
  /**
   * Messages to broadcast.
   */
  messages: EncodeObject[];
  /**
   * Address of who is signing the transaction.
   */
  accountAddressOrWallet: string | Wallet;
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
  const theme = useTheme();
  const { params } = useRoute<NavProps['route']>();
  const { accountAddressOrWallet, messages, memo, title, onSuccess, onCancel } = params;
  const estimateFees = useEstimateFees();
  const [estimatingFees, setEstimatingFees] = React.useState(false);
  const [feesResult, setFeesResult] = React.useState<Result<StdFee, Error>>();
  const broadcastTx = useBroadcastTx();
  const [broadcastingTx, setBroadcastingTx] = React.useState(false);
  const toast = useToast();
  // Call cancel callback if the use goes back.
  useOnBackAction(() => {
    onCancel && onCancel();
  }, [onCancel]);

  React.useEffect(() => {
    (async () => {
      setFeesResult(undefined);
      setEstimatingFees(true);
      let address: string;
      if (typeof accountAddressOrWallet === 'object') {
        address = accountAddressOrWallet.address;
      } else {
        address = accountAddressOrWallet;
      }
      const estimatedFees = await estimateFees(address, messages, memo);
      setEstimatingFees(false);
      setFeesResult(estimatedFees);
    })();

    // Safe to ignore, we want to estimate the fees just when we enter this screen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBroadcastTx = React.useCallback(async () => {
    if (feesResult?.isOk()) {
      setBroadcastingTx(true);
      const result = await broadcastTx(accountAddressOrWallet, messages, feesResult.value, memo);
      setBroadcastingTx(false);

      if (result.isErr() && !isCanceledOperationError(result.error)) {
        toast.show(result.error.message.toString(), {
          type: ToastConfig.ERROR_NO_RETRY,
        });
      } else if (result.isOk() && onSuccess) {
        onSuccess(result.value);
      }
    }
  }, [accountAddressOrWallet, broadcastTx, feesResult, memo, messages, onSuccess, toast]);

  return (
    <DView style={styles.root}>
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
              <Typography.Body5>{JSON.stringify(messages)}</Typography.Body5>
            </ScrollView>
            {estimatingFees || feesResult === undefined ? (
              /* TODO: Create a proper UI with a spinner or something else */
              <Typography.Body5>Estimating fees...</Typography.Body5>
            ) : (
              /* TODO: Create a proper UI to render the fee result */
              <Typography.Body5>
                Fees:{' '}
                {feesResult.isOk() ? JSON.stringify(feesResult.value) : feesResult.error.message}
              </Typography.Body5>
            )}
            <Typography.Body5>
              {t('memo')}: {memo ?? 'N/A'}
            </Typography.Body5>
          </>
        )}
      </View>
      <Button
        mode={ButtonMode.CONTAINED}
        size={ButtonSize.M}
        backgroundColor={theme.colors.surfaceBlack}
        textColor={theme.colors.white}
        onPress={handleBroadcastTx}
        loading={broadcastingTx}
        disabled={estimatingFees || feesResult?.isErr() || broadcastingTx}>
        {t('broadcast tx')}
      </Button>
    </DView>
  );
};

export default BroadcastTxOnChain;
