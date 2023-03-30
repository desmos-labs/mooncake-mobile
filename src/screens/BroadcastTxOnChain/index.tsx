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
import {
  EncodeObject,
  MsgAddReactionTypeUrl,
  MsgCreateRelationshipTypeUrl,
  MsgCreateReportTypeUrl,
  MsgDeleteRelationshipTypeUrl,
  MsgGrantAllowanceTypeUrl,
  MsgGrantTypeUrl,
  MsgRemoveReactionTypeUrl,
  MsgRevokeAllowanceTypeUrl,
} from '@desmoslabs/desmjs';
import useOnBackAction from 'hooks/navigation/useOnBackAction';
import { Result } from 'neverthrow';
import { StdFee } from '@cosmjs/amino';
import Button from 'components/Button';
import { isCanceledOperationError } from 'types/error';
import { Wallet } from 'types/wallet';
import { Box, useTheme } from 'native-base';
import useCustomToast from 'hooks/extended/useCustomToast';
import { PendingTransaction } from 'types/transactions';
import useEstimateTransactionFees from 'hooks/transactions/useEstimateTransactionFees';
import TransactionRow from 'screens/BroadcastTxOnChain/components/TransactionRow';
import { formatCoins } from 'lib/FormatUtils';
import _ from 'lodash';
import TopBar from 'components/TopBar';
import { MsgExecuteContractTypeUrl } from 'config/AutzGrants';
import useBroadcastTx from './useBroadcastTx';
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

  onSuccess?: (transaction: PendingTransaction) => void;
  onCancel?: () => void;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.BROADCAST_TX_ON_CHAIN>;

/**
 * Screen that allows the user to broadcast a transaction on chain.
 * @constructor
 */
const BroadcastTxOnChain: React.FC = () => {
  const { t } = useTranslation('broadcastTxOnChain');
  const styles = useStyles();
  const theme = useTheme();

  const { params } = useRoute<NavProps['route']>();
  const { accountAddressOrWallet, messages, memo, title, onSuccess, onCancel } = params;

  // -----------------------------------------------------------------------
  // --- Hooks
  // -----------------------------------------------------------------------

  const toast = useCustomToast();
  const estimateFees = useEstimateTransactionFees();
  const broadcastTx = useBroadcastTx();

  // -----------------------------------------------------------------------
  // --- State
  // -----------------------------------------------------------------------

  const [estimatingFees, setEstimatingFees] = React.useState(false);
  const [feesResult, setFeesResult] = React.useState<Result<StdFee, Error>>();
  const [broadcastingTx, setBroadcastingTx] = React.useState(true);

  // -----------------------------------------------------------------------
  // --- Back action
  // -----------------------------------------------------------------------

  // Call cancel callback if the use goes back.
  useOnBackAction(() => {
    onCancel && onCancel();
  }, [onCancel]);

  // -----------------------------------------------------------------------
  // --- Effects
  // -----------------------------------------------------------------------

  React.useEffect(() => {
    handleEstimateFees();
    // Safe to ignore, we want to estimate the fees just when we enter this screen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -----------------------------------------------------------------------
  // --- Callbacks
  // -----------------------------------------------------------------------
  const handleEstimateFees = React.useCallback(async () => {
    setFeesResult(undefined);
    setEstimatingFees(true);

    // Get the address of the user
    let address: string;
    if (typeof accountAddressOrWallet === 'object') {
      address = accountAddressOrWallet.address;
    } else {
      address = accountAddressOrWallet;
    }

    // Estimate the fees
    const estimatedFees = await estimateFees(address, messages, memo);
    setEstimatingFees(false);
    setFeesResult(estimatedFees);
  }, [accountAddressOrWallet, estimateFees, memo, messages]);

  // -----------------------------------------------------------------------
  // --- Memoized values
  // -----------------------------------------------------------------------

  const broadcasterAddress: string = React.useMemo(() => {
    return (accountAddressOrWallet as Wallet).address || (accountAddressOrWallet as string);
  }, [accountAddressOrWallet]);

  const transactionType: string = React.useMemo(() => {
    const msgTypes = messages.map(x => x.typeUrl);

    // turn the msgType array into an object for faster indexing.
    const msgTypeObj: { [index: string]: number } = msgTypes.reduce((acc, cur) => {
      return {
        ...acc,
        [cur]: 1,
      };
    }, {});

    // Authorization
    if (
      msgTypeObj[MsgRevokeAllowanceTypeUrl] ||
      msgTypeObj[MsgGrantAllowanceTypeUrl] ||
      msgTypeObj[MsgGrantTypeUrl]
    ) {
      return t('broadcastTxOnChain:authorization');
    }
    // like post
    if (msgTypeObj[MsgAddReactionTypeUrl]) {
      return t('broadcastTxOnChain:likePost');
    }
    // dislike post
    if (msgTypeObj[MsgRemoveReactionTypeUrl]) {
      return t('broadcastTxOnChain:dislikePost');
    }
    // smart contracts
    if (msgTypeObj[MsgExecuteContractTypeUrl]) {
      // tipping a post
      // TODO: figure out how to differentiate between smart contracts
      return t('broadcastTxOnChain:tipPost');
    }
    // follow a user
    if (msgTypeObj[MsgCreateRelationshipTypeUrl]) {
      return t('broadcastTxOnChain:followUser');
    }
    // unfollow a user
    if (msgTypeObj[MsgDeleteRelationshipTypeUrl]) {
      return t('broadcastTxOnChain:unfollowUser');
    }
    if (msgTypeObj[MsgCreateReportTypeUrl]) {
      return t('broadcastTxOnChain:reportPost');
    }

    // unmapped, return all transaction types as a string
    return msgTypes.join(', ');
  }, [messages, t]);

  const transactionFee = React.useMemo(() => {
    if (!feesResult) {
      return '';
    }
    if (feesResult.isOk()) {
      return formatCoins(_.get(feesResult, 'value.amount'));
    }
    if (feesResult.isErr()) {
      return t('errorOccurredPleaseTryAgain');
    }
  }, [feesResult, t]);

  const TopBarOrEmptyView = React.useMemo(() => {
    if (broadcastingTx) return <View />;
    return <TopBar />;
  }, [broadcastingTx]);

  // -----------------------------------------------------------------------
  // --- Actions
  // -----------------------------------------------------------------------

  const handleBroadcastTx = React.useCallback(async () => {
    if (feesResult?.isOk()) {
      setBroadcastingTx(true);
      const result = await broadcastTx(accountAddressOrWallet, messages, feesResult.value, memo);
      setBroadcastingTx(false);

      if (result.isErr() && !isCanceledOperationError(result.error)) {
        toast.success(result.error.message);
      } else if (result.isOk() && onSuccess) {
        onSuccess(result.value);
      }
    }
  }, [accountAddressOrWallet, broadcastTx, feesResult, memo, messages, onSuccess, toast]);

  const broadcastTxAnimation = React.useMemo(() => {
    if (broadcastingTx) {
      return (
        <Box flex={1} alignItems="center" justifyContent="center">
          <ThemedLottieView autoSize autoPlay loop source={broadcastAnim} />
          <Spacer paddingVertical={12}>
            <Typography.H4>{title || t('transaction broadcasting')}</Typography.H4>
          </Spacer>
          <Typography.Body6>{t('please wait')}</Typography.Body6>
        </Box>
      );
    }
  }, [broadcastingTx, t, title]);

  // -----------------------------------------------------------------------
  // --- Screen rendering
  // -----------------------------------------------------------------------

  return (
    <DView topBar={TopBarOrEmptyView} style={styles.root}>
      {!broadcastingTx && (
        <Box px="m" mb="50px">
          <Typography.H3>{t('header')}</Typography.H3>
        </Box>
      )}

      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        {/* Broadcasting animation shown while the transaction it's broadcasting */}
        {broadcastTxAnimation}
        {/* Tx type, tx fees */}
        {!broadcastingTx && (
          <>
            <TransactionRow title={t('address')} subtitle={broadcasterAddress} />
            <TransactionRow title={t('type')} subtitle={transactionType} />
            <TransactionRow title={t('fee')} isLoading={!feesResult} subtitle={transactionFee} />
            <Box flex={1} justifyContent="center">
              <Typography.Body5>
                {feesResult && feesResult?.isErr() && feesResult.error.message}
              </Typography.Body5>
            </Box>
          </>
        )}
      </ScrollView>
      <Button
        size={44}
        mx="m"
        backgroundColor={theme.colors.surfaceBlack}
        textColor={theme.colors.white}
        onPress={feesResult?.isErr() ? handleEstimateFees : handleBroadcastTx}
        isLoading={broadcastingTx}
        disabled={estimatingFees || broadcastingTx}>
        {feesResult?.isErr() ? t('common:retry') : t('broadcast tx')}
      </Button>
    </DView>
  );
};

export default BroadcastTxOnChain;
