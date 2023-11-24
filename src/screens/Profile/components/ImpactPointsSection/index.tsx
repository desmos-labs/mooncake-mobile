import { useNavigation } from '@react-navigation/native';
import { infoIcon } from 'assets/images';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import StyledSpinner from 'components/StyledSpinner';
import Typography from 'components/Typography';
import { Image } from 'expo-image';
import useAccountImpactPoints from 'hooks/impactpoints/useAccountImpactPoints';
import { HStack, useTheme } from 'native-base';
import ROUTES from 'navigation/routes';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import useStyles from './useStyles';

/**
 * Component that renders the section showing the number of impact points of the profile.
 * @constructor
 */
const ImpactPointsSection = () => {
  const theme = useTheme();
  const styles = useStyles();
  const { t } = useTranslation('profile');
  const { navigate } = useNavigation<any>();

  const {
    impactPoints,
    loading: areImpactPointsLoading,
    refetch: refreshImpactPoints,
  } = useAccountImpactPoints();

  useEffect(() => {
    refreshImpactPoints();
  }, []);

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  const handleInfoPress = useCallback(() => {
    navigate(ROUTES.CONVERTIBLE_POINTS_MODAL);
  }, [navigate]);

  const handleHowToEarnPoints = useCallback(() => {
    navigate(ROUTES.IMPACT_POINTS_MODAL);
  }, [navigate]);

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  if (areImpactPointsLoading) {
    return (
      <View style={styles.container}>
        <StyledSpinner />
      </View>
    );
  }

  return (
    <View>
      <View style={styles.container}>
        <HStack justifyContent="space-between">
          {/* Title with an info icon */}
          <TouchableOpacity onPress={handleInfoPress} style={styles.infoButton}>
            <Typography.Body6 style={styles.infoButtonText}>
              {t('convertible points')}
            </Typography.Body6>
            <Image source={infoIcon} style={styles.infoButtonIcon} />
          </TouchableOpacity>

          {/* Link to know how to earn impact points */}
          <Button
            size={32}
            variant="link"
            textColor={theme.colors.butterOrange01}
            onPress={handleHowToEarnPoints}>
            {t('how to earn points')}
          </Button>
        </HStack>

        {/* Margin */}
        <Spacer paddingVertical={theme.spacing.s} />

        {/* Number of impact points */}
        <Typography.H3
          style={{
            color: theme.colors.surfaceBlack,
          }}>
          {impactPoints} {t('points')}
        </Typography.H3>
      </View>
    </View>
  );
};

export default ImpactPointsSection;
