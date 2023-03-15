import { useSetting } from '@recoil/settings';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStateValue } from '@recoil/appState';
import { Coin } from '@cosmjs/stargate';
import { findCoinByDenom } from 'lib/ChainsUtils';
import { safeParseFloat } from 'lib/FormatUtils';
import useSendTip from 'hooks/tips/useSendTip';
import { TipTarget } from 'types/tips';

/**
 * Hook that allows to get the tip fee percentage to be considered when sending tips.
 */
export const useTipFeePercentage = () => {
  const subspaceParams = useAppStateValue('subspaceParams');
  return subspaceParams.tipsContractConfig?.serviceFeePercentage ?? 0;
};

/**
 * Returns the currency that should be used to tip the post.
 */
const useTipCurrency = () => {
  const chainConfig = useSetting('currentChain');
  // TODO: allow the user to select which coin he wants to use as the tip, instead of forcing the staking currency
  return chainConfig.stakeCurrency;
};

/**
 * Hook that allows to get the balance of coin that should be used to send tips.
 * @param accountBalance {[]Coin} - Current account balance.
 */
export const useCoinBalance = (accountBalance: Coin[]): Coin => {
  const tipCurrency = useTipCurrency();
  return (
    findCoinByDenom(accountBalance, tipCurrency.coinMinimalDenom) ?? {
      amount: '0',
      denom: tipCurrency.coinMinimalDenom,
    }
  );
};

/**
 * Hook that returns the default tips amount shown to the user.
 */
export const useDefaultTipsAmounts = () => [1, 5, 10];

/**
 * Hook that to determine whether a default tip button should be disabled or not.
 * @param accountBalance {[]Coin} - Balance of the tipper account.
 */
export const useShouldDisableTipButton = (accountBalance: Coin[]) => {
  const coinBalance = useCoinBalance(accountBalance);
  const coinAmount = safeParseFloat(coinBalance.amount);
  const tipsFeePercentage = useTipFeePercentage();
  return useCallback(
    (value: number) => {
      return coinAmount / 1_000_000 < value + tipsFeePercentage / 100;
    },
    [coinAmount, tipsFeePercentage],
  );
};

export interface FormValues {
  readonly amount: string;
}

/**
 * Hook that returns the initial values of the form allowing to tip a specific post.
 */
export const useInitialFormValues = (): FormValues => {
  return {
    amount: '',
  };
};

/**
 * Hook that returns the function that allows validating the form to tip a post.
 * @param accountBalance {[]Coin} - Current balance of the account tipping the post.
 */
export const useValidateForm = (accountBalance: Coin[]) => {
  const { t } = useTranslation('sendTips');

  // Account balance
  const coinBalance = useCoinBalance(accountBalance);

  // Tips config
  const minTipValue = 1;
  const maxTipValue = safeParseFloat(coinBalance.amount) * 0.99;

  return useCallback(
    (values: FormValues) => {
      const errors: any = {};

      const insertedAmount = safeParseFloat(values.amount);
      if (insertedAmount < minTipValue) {
        errors.amount = t('too few');
      } else if (insertedAmount > maxTipValue) {
        errors.amount = t('too much');
      }

      return errors;
    },
    [maxTipValue, minTipValue, t],
  );
};

/**
 * Hook that allows to send a tip to the given post.
 * @param target {TipTarget} - Target to which to send the tip.
 */
export const useSendTipToTarget = (target: TipTarget) => {
  const tipCurrency = useTipCurrency();
  const sendTip = useSendTip();

  return useCallback(
    async (values: FormValues) => {
      // Build the tip amount
      const tipAmount: Coin = {
        denom: tipCurrency.coinMinimalDenom,
        amount: (safeParseFloat(values.amount) * 10 ** tipCurrency.coinDecimals).toString(),
      };

      // Send the tip
      return sendTip({
        target,
        amount: [tipAmount],
      });
    },
    [sendTip, target, tipCurrency.coinDecimals, tipCurrency.coinMinimalDenom],
  );
};
