import { errorImage } from 'assets/images';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet } from 'react-native';
import { Box } from 'native-base';

const NoTweets = () => {
  const { t } = useTranslation('connectApp');

  return (
    <Box alignItems="center">
      <Spacer paddingVertical={40} />
      <Image source={errorImage} style={styles.errorImage} />

      <Typography.Body6>{t('noTweets')}</Typography.Body6>
    </Box>
  );
};

export default NoTweets;

const styles = StyleSheet.create({
  errorImage: {
    height: 152,
    marginBottom: 20,
    resizeMode: 'cover',
    width: 190,
  },
});
