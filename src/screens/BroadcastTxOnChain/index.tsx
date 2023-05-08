import { StackScreenProps } from '@react-navigation/stack';
import DView from 'components/DView';
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
  MsgCreatePostTypeUrl,
  MsgCreateRelationshipTypeUrl,
  MsgCreateReportTypeUrl,
  MsgDeleteRelationshipTypeUrl,
  MsgGrantAllowanceTypeUrl,
  MsgGrantTypeUrl,
  MsgRemoveReactionTypeUrl,
  MsgRevokeAllowanceTypeUrl,
  MsgSaveProfileTypeUrl,
  MsgUnblockUserTypeUrl,
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
import TopBar from 'components/TopBar';
import { MsgExecuteContractTypeUrl } from 'config/AutzGrants';
import { MsgBlockUserTypeUrl } from '@desmoslabs/desmjs/build/const/relationships';
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
  const [broadcastingTx, setBroadcastingTx] = React.useState(false);

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

    // Create an array which will hold our mapped tx types. This is necessary as authorization type messages may also
    // include a second type url.
    const txStrings: string[] = [];

    // Authorization
    if (
      msgTypeObj[MsgRevokeAllowanceTypeUrl] ||
      msgTypeObj[MsgGrantAllowanceTypeUrl] ||
      msgTypeObj[MsgGrantTypeUrl]
    ) {
      txStrings.push(t('broadcastTxOnChain:authorization'));
    }
    // Save a profile
    if (msgTypeObj[MsgSaveProfileTypeUrl]) {
      txStrings.push(t('broadcastTxOnChain:saveProfile'));
    }
    // Create post
    if (msgTypeObj[MsgCreatePostTypeUrl]) {
      txStrings.push(t('broadcastTxOnChain:createPost'));
    }
    // Like a post
    if (msgTypeObj[MsgAddReactionTypeUrl]) {
      txStrings.push(t('broadcastTxOnChain:likePost'));
    }
    // Dislike post
    if (msgTypeObj[MsgRemoveReactionTypeUrl]) {
      txStrings.push(t('broadcastTxOnChain:dislikePost'));
    }
    // Follow a user
    if (msgTypeObj[MsgCreateRelationshipTypeUrl]) {
      txStrings.push(t('broadcastTxOnChain:followUser'));
    }
    // Unfollow a user
    if (msgTypeObj[MsgDeleteRelationshipTypeUrl]) {
      txStrings.push(t('broadcastTxOnChain:unfollowUser'));
    }
    // Report a user
    if (msgTypeObj[MsgCreateReportTypeUrl]) {
      txStrings.push(t('broadcastTxOnChain:reportPost'));
    }
    // Block a user
    if (msgTypeObj[MsgBlockUserTypeUrl]) {
      txStrings.push(t('broadcastTxOnChain:blockUser'));
    }
    // Unblock a user
    if (msgTypeObj[MsgUnblockUserTypeUrl]) {
      txStrings.push(t('broadcastTxOnChain:unblockUser'));
    }
    // smart contracts
    if (msgTypeObj[MsgExecuteContractTypeUrl]) {
      // tipping a post
      // TODO: figure out how to differentiate between smart contracts
      txStrings.push(t('broadcastTxOnChain:tipPost'));
    }

    // unmapped, return all transaction types as a string
    return txStrings.length > 0 ? txStrings.join('\n') : msgTypes.join(', ');
  }, [messages, t]);

  const transactionFee = React.useMemo(() => {
    if (!feesResult) {
      return '';
    }
    if (feesResult.isOk()) {
      return formatCoins(feesResult.value.amount);
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
          <Box marginY="s">
            <Typography.H4>{title || t('transaction broadcasting')}</Typography.H4>
          </Box>
          <Typography.Body6>{t('please wait')}</Typography.Body6>
        </Box>
      );
    }
  }, [broadcastingTx, t, title]);

  // -----------------------------------------------------------------------
  // --- Screen rendering
  // -----------------------------------------------------------------------

  return (
    <DView topBar={TopBarOrEmptyView} style={styles.root} disableHideKeyboardTouchable>
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
      {!broadcastingTx && (
        <Button
          size={44}
          mx="m"
          my="m"
          backgroundColor={theme.colors.surfaceBlack}
          textColor={theme.colors.white}
          onPress={feesResult?.isErr() ? handleEstimateFees : handleBroadcastTx}
          isLoading={broadcastingTx}
          disabled={estimatingFees || broadcastingTx}>
          {feesResult?.isErr() ? t('common:retry') : t('broadcast tx')}
        </Button>
      )}
    </DView>
  );
};

export default BroadcastTxOnChain;
