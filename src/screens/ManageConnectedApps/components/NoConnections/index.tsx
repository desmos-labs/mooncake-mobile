import { modalSuccess } from 'assets/images';
import Typography from 'components/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';

const NoAppConnections = () => {
  const { t } = useTranslation('disconnectApp');

  return (
    <View style={{ alignItems: 'center' }}>
      <Image
        source={modalSuccess}
        style={{
          width: 190,
          height: 188,
          resizeMode: 'contain',
          marginBottom: 20,
        }}
      />

      <Typography.H5>{t('noConnectedApps')}</Typography.H5>
    </View>
  );
};

export default NoAppConnections;
