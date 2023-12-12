import Button from 'components/Button';
import Typography from 'components/Typography';
import { makeStyle } from 'config/theme';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Spacer from 'components/Spacer';
import DTextInput from 'components/DTextInput';
import useAccountBalance from 'hooks/balance/useAccountBalance';
import { formatCoins } from 'lib/FormatUtils';

interface TipUserBottomSheetProps {
  /**
   * Address of the user to tip.
   */
  readonly userAddress: string;
}

/**
 * Bottom sheet component to send a tip to a user.
 */
const TipUserBottomSheet: React.FC<TipUserBottomSheetProps> = () => {
  const { t } = useTranslation('tips');
  const styles = useStyles();

  const [amount, setAmount] = React.useState<string>();
  const { balance, error: fetchBalanceError, loading: loadingBalance } = useAccountBalance();

  const interactionDisabled = React.useMemo(
    () => loadingBalance || fetchBalanceError !== undefined,
    [fetchBalanceError, loadingBalance],
  );

  const onInputTextChange = React.useCallback(
    (text: string) => {
      if (loadingBalance) return;

      setAmount(text.trimEnd());
    },
    [loadingBalance],
  );

  const sendTip = React.useCallback(() => {
    console.warn('TODO: send tip');
  }, []);

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
        {t('available')} {formatCoins(balance)}
      </Typography.Body7>
    );
  }, [balance, fetchBalanceError, loadingBalance, styles.availableText, styles.errorText, t]);

  return (
    <View style={styles.root}>
      <Typography.Semibold22 style={styles.header}>{t('tip')}</Typography.Semibold22>
      <Typography.Subtitle3 style={styles.subtitle}>
        {t('how much do you want to send')}
      </Typography.Subtitle3>

      {/* Amount selector row */}
      <View style={styles.quickSelectorRow}>
        <Button
          variant={amount === '1' ? 'solid' : 'outline'}
          style={styles.quickSelectButton}
          disabled={interactionDisabled}
          onPress={() => {
            setAmount('1');
          }}>
          1 DSM
        </Button>
        <Spacer paddingLeft="m" />
        <Button
          variant={amount === '5' ? 'solid' : 'outline'}
          style={styles.quickSelectButton}
          disabled={interactionDisabled}
          onPress={() => {
            setAmount('5');
          }}>
          5 DSM
        </Button>
        <Spacer paddingLeft="m" />
        <Button
          variant={amount === '10' ? 'solid' : 'outline'}
          disabled={interactionDisabled}
          style={styles.quickSelectButton}
          onPress={() => {
            setAmount('10');
          }}>
          10 DSM
        </Button>
      </View>

      {/* Custom amount input */}
      <Spacer paddingTop={20} />
      <DTextInput
        style={styles.inputContainer}
        editable={!interactionDisabled}
        rightElement={<Typography.Subtitle3>DSM</Typography.Subtitle3>}
        numberOfLines={1}
        placeholder={t('insert amount')}
        value={amount}
        onChangeText={onInputTextChange}
      />
      {userBalanceComponent}
      <Spacer paddingTop="l" />

      {/* Message to user input */}
      <Typography.Subtitle3>{t('message', { ns: 'common' })}</Typography.Subtitle3>
      <Spacer paddingTop="s" />
      <DTextInput
        style={styles.inputContainer}
        editable={!interactionDisabled}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        placeholder={t('message for the user')}
      />

      <Spacer paddingTop={20} />
      <Button bgColor="black" textColor="white" disabled={interactionDisabled} onPress={sendTip}>
        {t('confirm', { ns: 'common' })}
      </Button>
    </View>
  );
};

export default TipUserBottomSheet;

const useStyles = makeStyle(theme => ({
  root: {
    paddingHorizontal: 20,
    paddingBottom: 56,
  },
  header: {
    marginTop: theme.spacing.l,
    alignSelf: 'center',
  },
  subtitle: {
    marginTop: 20,
  },
  quickSelectorRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  quickSelectButton: {
    flex: 1,
  },
  inputContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.grey02,
    paddingHorizontal: theme.spacing.s,
    paddingVertical: theme.spacing.m,
  },
  availableText: {
    marginTop: 12,
    color: theme.colors.accentGreen01,
  },
  errorText: {
    marginTop: 12,
    color: theme.colors.accentRed01,
  },
}));
