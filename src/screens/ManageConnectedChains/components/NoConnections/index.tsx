import {modalSuccess} from 'assets/images';
import Typography from 'components/Typography';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Image, View} from 'react-native';

const NoConnections = () => {
  const {t} = useTranslation('manageChains');

  return (
    <View style={{alignItems: 'center'}}>
      <Image
        source={modalSuccess}
        style={{
          width: 190,
          height: 152,
          resizeMode: 'contain',
          marginBottom: 20,
        }}
      />

      <Typography.H5>{t('noConnectedAddresses')}</Typography.H5>
    </View>
  );
};

export default NoConnections;
