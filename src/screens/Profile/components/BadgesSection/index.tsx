import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { verticalScale } from 'react-native-size-matters';

/**
 * A component that displays the user's badges.
 * @constructor
 */
const BadgesSection = () => {
  const theme = useTheme();
  const { t } = useTranslation('profile');

  return (
    <View
      style={{
        flex: 1,
        paddingVertical: theme.spacing.m,
        height: verticalScale(140),
      }}>
      <Typography.Subtitle2>{t('badges')}</Typography.Subtitle2>
      <Spacer paddingBottom={theme.spacing.m} paddingTop={theme.spacing.xs}>
        <Typography.Body7 style={{ color: theme.colors.midGrey, alignSelf: 'center' }}>
          Coming soon...
        </Typography.Body7>
      </Spacer>
    </View>
  );
};

export default BadgesSection;
