import Typography from 'components/Typography';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { Divider, useTheme } from 'react-native-paper';
import { verticalScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Coin } from '@cosmjs/stargate';
import { useActiveAccountAddress } from '@recoil/accounts';
import { formatCoins, formatNumber } from 'lib/FormatUtils';
import useBalanceFiatAmount from 'hooks/balance/useBalanceFiatAmount';
import useNavigateToProfileOperations from 'hooks/navigation/useNavigateToProfileOperations';
import useStyles from './useStyles';

export interface BalanceSectionProps {
  /**
   * Address of the profile for which to display the balance.
   */
  readonly address: string;
  /**
   * Balance of the profile.
   */
  readonly balance: Coin[];
  /**
   * Whether the balance is loading.
   */
  readonly isLoading: boolean;
}

/**
 * A component that displays the user's balance.
 * @constructor
 */
const BalanceSection = (props: BalanceSectionProps) => {
  const theme = useTheme();
  const styles = useStyles();
  const { t } = useTranslation('profile');

  const { address, balance, isLoading } = props;

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const activeAccountAddress = useActiveAccountAddress();
  const isGuestProfile = activeAccountAddress !== address;

  const navigateToProfileOperations = useNavigateToProfileOperations();

  const {
    symbol: currencySymbol,
    amount: fiatAmount,
    loading: isFiatAmountLoading,
  } = useBalanceFiatAmount(balance);

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  // Callback to navigate to the profile operations screen
  const handlePressOperations = useCallback(() => {
    navigateToProfileOperations(address);
  }, [address, navigateToProfileOperations]);

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  return (
    <View>
      {balance && !isLoading ? (
        <View style={[styles.container, !isGuestProfile && { height: verticalScale(140) }]}>
          <Typography.Body6>{t('balance')}</Typography.Body6>
          <Typography.H3
            style={{
              color: theme.colors.surfaceBlack,
            }}>
            {formatCoins(balance, ', ')}
          </Typography.H3>

          {/* Fiat amount (USD, EUR, etc) */}
          {isFiatAmountLoading ? (
            <ActivityIndicator color={theme.colors.surfaceBlack} />
          ) : (
            <Typography.Body6 style={{ color: theme.colors.midGrey }}>
              {currencySymbol}
              {formatNumber(fiatAmount)}
            </Typography.Body6>
          )}

          {/* Personal data - Only displayed if not guest */}
          {!isGuestProfile && (
            <>
              <Divider style={styles.divider} />

              {/* Operations button */}
              <TouchableOpacity style={styles.button} onPress={handlePressOperations}>
                <Typography.Body6
                  style={{
                    marginRight: theme.spacing.s,
                    color: theme.colors.butterOrange01,
                  }}>
                  {t('operations')}
                </Typography.Body6>
                <Icon
                  name="angle-right"
                  color={theme.colors.butterOrange01}
                  size={22}
                  allowFontScaling
                />
              </TouchableOpacity>
            </>
          )}
        </View>
      ) : (
        <View style={styles.container}>
          <ActivityIndicator color={theme.colors.surfaceBlack} />
        </View>
      )}
    </View>
  );
};

export default BalanceSection;
