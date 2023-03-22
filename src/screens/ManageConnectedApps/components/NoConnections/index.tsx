import { modalSuccess } from 'assets/images';
import Typography from 'components/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet } from 'react-native';
import { Box } from 'native-base';

const NoAppConnections = () => {
  const { t } = useTranslation('disconnectApp');

  return (
    <Box alignItems="center">
      <Image source={modalSuccess} style={styles.successImage} />

      <Typography.H5>{t('noConnectedApps')}</Typography.H5>
    </Box>
  );
};

export default NoAppConnections;

const styles = StyleSheet.create({
  successImage: {
    height: 188,
    marginBottom: 20,
    resizeMode: 'contain',
    width: 190,
  },
});
