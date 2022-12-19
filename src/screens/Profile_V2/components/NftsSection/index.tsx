import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {verticalScale} from 'react-native-size-matters';

const NftsSection = () => {
  const theme = useTheme();
  /*
  const styles = useStyles();
*/
  const {t} = useTranslation('profile');

  return (
    <View
      style={{
        flex: 1,
        paddingVertical: theme.spacing.m,
        height: verticalScale(140),
      }}>
      <Typography.Subtitle2>{t('nfts')}</Typography.Subtitle2>
      <Spacer paddingBottom={theme.spacing.m} paddingTop={theme.spacing.xs}>
        <Typography.Body7
          style={{color: theme.colors.midGrey, alignSelf: 'center'}}>
          Coming soon...
        </Typography.Body7>
      </Spacer>
    </View>
  );
};

export default NftsSection;
