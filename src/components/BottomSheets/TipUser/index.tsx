import { coin } from '@cosmjs/stargate';
import { Coin } from '@desmoslabs/desmjs-types/cosmos/base/v1beta1/coin';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCurrentChainInfo } from '@recoil/settings';
import Button from 'components/Button';
import DTextInput from 'components/DTextInput';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import { ToastType } from 'config/toast/toastConfig';
import useAccountBalance from 'hooks/balance/useAccountBalance';
import useSendTip from 'hooks/tips/useSendTip';
import useToast from 'hooks/toasts/useToast';
import { formatCoin, safeParseFloat } from 'lib/FormatUtils';
import { getThousandsSeparator, isStringNumberValid } from 'lib/NumberUtils';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import useStyles from './useStyles';

interface TipUserBottomSheetProps {
  /**
   * Address of the user to tip.
   */
  readonly toTipUserAddress: string;
}

/**
 * Bottom sheet component to send a tip to a user.
 */
const TipUserBottomSheet: React.FC<TipUserBottomSheetProps> = ({ toTipUserAddress }) => {
  const { t } = useTranslation('tips');
  const styles = useStyles();

  // -----------------------------------------------------------------------------------
  // --- States
  // -----------------------------------------------------------------------------------

  const [textAmount, setTextAmount] = React.useState<string>('');
  const [tipCoin, setTipCoin] = React.useState<Coin>();

  // -----------------------------------------------------------------------------------
  // --- Hooks
  // -----------------------------------------------------------------------------------

  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const showToast = useToast();
  const currentChain = useCurrentChainInfo()!;
  const { balance, error: fetchBalanceError, loading: loadingBalance } = useAccountBalance();
  const sendTipToUser = useSendTip();

  const interactionDisabled = React.useMemo(
    () => loadingBalance || fetchBalanceError !== undefined,
    [fetchBalanceError, loadingBalance],
  );

  // Memoize the amount of coins that the user can spend.
  const spendableAmount = React.useMemo(() => {
    if (loadingBalance || fetchBalanceError) {
      return coin(0, currentChain.stakeCurrency.coinMinimalDenom);
    }

    const userBalance = balance.find(c => c.denom === currentChain.stakeCurrency.coinMinimalDenom);
    // User without balance, return a 0 coin.
    if (userBalance === undefined) {
      return coin(0, currentChain.stakeCurrency.coinMinimalDenom);
    }

    return userBalance;
  }, [balance, currentChain.stakeCurrency.coinMinimalDenom, fetchBalanceError, loadingBalance]);

  const onAmountChange = React.useCallback(
    (text: string) => {
      if (loadingBalance) {
        return;
      }

      // Sanitize the amount by removing any endingin space and the thousand
      // separators.
      const sanitizedText = text
        .trimEnd()
        .replace(new RegExp(`[${getThousandsSeparator()}]`, 'g'), '');

      // Allow the user to clear the amount.
      if (sanitizedText === '') {
        setTipCoin(undefined);
        setTextAmount(sanitizedText);
        return;
      }

      // Prevent an invalid amount from being entered.
      if (!isStringNumberValid(sanitizedText)) {
        setTipCoin(undefined);
        return;
      }

      // Get the user spendable amount, parse it using en-US locale since is
      // encoded with this locale.
      const userBalance = safeParseFloat(spendableAmount.amount, 'en-US');
      // Parse the user input using the user's locale.
      const parsedAmount = safeParseFloat(sanitizedText);
      // Get the factor to convert the user input to the base currency.
      const conversionFactor = 10 ** currentChain.stakeCurrency.coinDecimals;
      // Convert the user input to the base currency.
      const sendAmountInBaseDenom = Math.trunc(parsedAmount * conversionFactor);

      if (userBalance >= sendAmountInBaseDenom) {
        setTipCoin(coin(sendAmountInBaseDenom, currentChain.stakeCurrency.coinMinimalDenom));
      } else {
        setTipCoin(undefined);
      }

      setTextAmount(sanitizedText);
    },
    [
      currentChain.stakeCurrency.coinDecimals,
      currentChain.stakeCurrency.coinMinimalDenom,
      loadingBalance,
      spendableAmount.amount,
    ],
  );

  const sendTip = React.useCallback(async () => {
    if (tipCoin === undefined) {
      return;
    }

    const result = await sendTipToUser(toTipUserAddress, [tipCoin]);

    if (result.isErr()) {
      showToast({
        toastType: ToastType.error,
        title: t('error', { ns: 'common' }),
        message: result.error.message,
      });
    } else {
      navigation.goBack();
    }
  }, [navigation, sendTipToUser, showToast, t, tipCoin, toTipUserAddress]);

  // -------- Components --------

  const userBalanceComponent = React.useMemo(() => {
    if (loadingBalance) {
      return <Typography.Body7 style={styles.availableText}>{t('available')} ...</Typography.Body7>;
    }

    if (fetchBalanceError) {
      return (
        <Typography.Body7 style={styles.errorText}>
          {`${t("can't get user's balance")}:\n`}
          {fetchBalanceError.message}
        </Typography.Body7>
      );
    }

    return (
      <Typography.Body7 style={styles.availableText}>
        {t('available')} {formatCoin(spendableAmount)}
      </Typography.Body7>
    );
  }, [
    fetchBalanceError,
    loadingBalance,
    spendableAmount,
    styles.availableText,
    styles.errorText,
    t,
  ]);

  return (
    <View style={styles.root}>
      <Typography.Semibold22 style={styles.header}>{t('tip')}</Typography.Semibold22>
      <Typography.Subtitle3 style={styles.subtitle}>
        {t('how much do you want to send')}
      </Typography.Subtitle3>
      {/* Amount selector row */}
      <View style={styles.quickSelectorRow}>
        <Button
          variant={textAmount === '1' ? 'solid' : 'outline'}
          style={styles.quickSelectButton}
          disabled={interactionDisabled}
          onPress={() => {
            onAmountChange('1');
          }}>
          1 DSM
        </Button>
        <Spacer paddingLeft="m" />
        <Button
          variant={textAmount === '5' ? 'solid' : 'outline'}
          style={styles.quickSelectButton}
          disabled={interactionDisabled}
          onPress={() => {
            onAmountChange('5');
          }}>
          5 DSM
        </Button>
        <Spacer paddingLeft="m" />
        <Button
          variant={textAmount === '10' ? 'solid' : 'outline'}
          disabled={interactionDisabled}
          style={styles.quickSelectButton}
          onPress={() => {
            onAmountChange('10');
          }}>
          10 DSM
        </Button>
      </View>
      {/* Custom amount input */}
      <Spacer paddingTop={20} />
      <DTextInput
        style={styles.inputContainer}
        showBorder
        error={tipCoin === undefined && textAmount !== ''}
        editable={!interactionDisabled}
        rightElement={<Typography.Subtitle3>DSM</Typography.Subtitle3>}
        numberOfLines={1}
        placeholder={t('insert amount')}
        value={textAmount}
        onChangeText={onAmountChange}
        keyboardType="numeric"
      />
      {userBalanceComponent}
      <Spacer paddingTop="l" />
      {/* Message to user input */}
      <Typography.Subtitle3>{t('message', { ns: 'common' })}</Typography.Subtitle3>
      <Spacer paddingTop="s" />
      <DTextInput
        style={styles.inputContainer}
        editable={!interactionDisabled}
        showBorder
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        placeholder={t('message for the user')}
      />
      <Spacer paddingTop={20} />
      <Button
        size={44}
        bgColor="black"
        textColor="white"
        disabled={interactionDisabled || tipCoin === undefined || tipCoin.amount === '0'}
        onPress={sendTip}>
        {t('confirm', { ns: 'common' })}
      </Button>
    </View>
  );
};

export default TipUserBottomSheet;
