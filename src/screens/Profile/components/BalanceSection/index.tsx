import { Coin } from '@cosmjs/stargate';
import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { FontAwesome } from '@expo/vector-icons';
import { useActiveAccountAddress } from '@recoil/accounts';
import { infoIcon } from 'assets/images';
import ImageButton from 'components/ImageButton';
import Spacer from 'components/Spacer';
import StyledSpinner from 'components/StyledSpinner';
import useBalanceFiatAmount from 'hooks/balance/useBalanceFiatAmount';
import useNavigateToProfileOperations from 'hooks/navigation/useNavigateToProfileOperations';
import { formatCoins, formatCurrencyAmount } from 'lib/FormatUtils';
import { Divider, HStack, useTheme, VStack } from 'native-base';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import useStyles from './useStyles';

interface BalanceSectionProps {
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
  /**
   * What to do when the info button in the balance section is pressed.
   */
  readonly handlePressBalanceInfo: () => void;
}

/**
 * A component that displays the user's balance.
 * @constructor
 */
const BalanceSection = (props: BalanceSectionProps) => {
  const theme = useTheme();
  const styles = useStyles();
  const { t } = useTranslation('profile');

  const { address, balance, isLoading, handlePressBalanceInfo } = props;

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
        <View style={styles.container}>
          <VStack>
            <HStack>
              <Typography.Regular14>{t('balance')}</Typography.Regular14>
              <ImageButton
                style={styles.infoButtonIcon}
                image={infoIcon}
                onPress={handlePressBalanceInfo}
              />
            </HStack>
            <Spacer paddingBottom="s" />
            <Typography.Semibold24
              style={{
                color: theme.colors.surfaceBlack,
              }}>
              {formatCoins(balance, ', ')}
            </Typography.Semibold24>
          </VStack>
          {/* Fiat amount (USD, EUR, etc) */}
          {isFiatAmountLoading ? (
            <StyledSpinner />
          ) : (
            <Typography.Regular14
              style={{ color: theme.colors.midGrey, paddingTop: theme.spacing.xs }}>
              {currencySymbol}
              {formatCurrencyAmount(fiatAmount)}
            </Typography.Regular14>
          )}
          {/* Personal data - Only displayed if not guest */}
          {!isGuestProfile && (
            <>
              <Divider style={styles.divider} />
              {/* Operations button */}
              <TouchableOpacity style={styles.button} onPress={handlePressOperations}>
                <Typography.Regular14
                  style={{
                    marginRight: theme.spacing.s,
                    color: theme.colors.butterOrange01,
                  }}>
                  {t('operations')}
                </Typography.Regular14>
                <FontAwesome
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
          <StyledSpinner />
        </View>
      )}
    </View>
  );
};

export default BalanceSection;
