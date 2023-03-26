import { modalSuccess } from 'assets/images';
import Typography from 'components/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet } from 'react-native';
import { Box } from 'native-base';

const NoConnections = () => {
  const { t } = useTranslation('manageChains');

  return (
    <Box alignItems="center">
      <Image source={modalSuccess} style={styles.image} />

      <Typography.H5>{t('noConnectedAddresses')}</Typography.H5>
    </Box>
  );
};

export default NoConnections;

// This component does not rely on any theme properties, so we can use StyleSheet.create
const styles = StyleSheet.create({
  image: {
    height: 188,
    marginBottom: 20,
    resizeMode: 'cover',
    width: 190,
  },
});
