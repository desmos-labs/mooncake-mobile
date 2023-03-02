import { useNavigation } from '@react-navigation/native';
import { infoIcon } from 'assets/images';
import Button, {ButtonMode, ButtonSize} from 'components/Button';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import ROUTES from 'navigation/routes';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTheme } from 'react-native-paper';
import useAccountImpactPoints from 'hooks/impactpoints/useAccountImpactPoints';
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
        <ActivityIndicator color={theme.colors.surfaceBlack} />
      </View>
    );
  }

  return (
    <View>
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {/* Title with an info icon */}
          <TouchableOpacity
            onPress={handleInfoPress}
            style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Typography.Body6
              style={{
                color: theme.colors.surfaceBlack,
                marginRight: 4,
              }}>
              {t('convertible points')}
            </Typography.Body6>
            <FastImage source={infoIcon} style={{ width: 22, height: 22 }} />
          </TouchableOpacity>

          {/* Link to know how to earn impact points */}
          <Button
            size={ButtonSize.S}
            mode={ButtonMode.TEXT}
            textColor={theme.colors.butterOrange01}
            onPress={handleHowToEarnPoints}>
            {t('how to earn points')}

          </Button>
        </View>

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
