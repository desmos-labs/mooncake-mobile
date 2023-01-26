import {useNavigation} from '@react-navigation/native';
import appSettingsState from '@recoil/settings';
import {infoIcon} from 'assets/images';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import ROUTES from 'navigation/routes';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useTheme} from 'react-native-paper';
import {useRecoilValue} from 'recoil';
import useStyles from './useStyles';

const ImpactPointsSection = ({
  impactPoints,
  impactPointsLoading,
}: {
  impactPoints: number;
  impactPointsLoading: boolean;
}) => {
  const theme = useTheme();
  const styles = useStyles();
  const {t} = useTranslation('profile');
  const {navigate} = useNavigation<any>();
  const {currentChain} = useRecoilValue(appSettingsState);
  return (
    <View>
      {!impactPointsLoading ? (
        <View style={styles.container}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity
              onPress={() => navigate(ROUTES.CONVERTIBLE_POINTS_MODAL)}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <Typography.Body6
                style={{
                  color: theme.colors.surfaceBlack,
                  marginRight: 4,
                }}>
                {t('convertible points')}
              </Typography.Body6>
              <FastImage source={infoIcon} style={{width: 22, height: 22}} />
            </TouchableOpacity>

            <Button
              mode="text"
              onPress={() => navigate(ROUTES.IMPACT_POINTS_MODAL)}>
              <Typography.Body7
                style={{
                  textTransform: 'none',
                  color: theme.colors.butterOrange01,
                }}>
                {t('how to earn points')}
              </Typography.Body7>
            </Button>
          </View>
          <Spacer paddingVertical={theme.spacing.s} />
          <Typography.H3
            style={{
              color: theme.colors.surfaceBlack,
            }}>
            {impactPoints} {t('points')}
          </Typography.H3>
          <Typography.Subtitle2
            style={{
              color: theme.colors.surfaceBlack,
            }}>
            0 {currentChain.currencies[0].coinDenom.toUpperCase()}
          </Typography.Subtitle2>
        </View>
      ) : (
        <View style={styles.container}>
          <ActivityIndicator color={theme.colors.surfaceBlack} />
        </View>
      )}
    </View>
  );
};

export default ImpactPointsSection;
