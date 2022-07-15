import React from 'react';
import {View, Image} from 'react-native';
import Typography from 'components/Typography';
import {useTranslation} from 'react-i18next';
import {noConnectedAddresses} from 'assets/images';

const NoConnections = () => {
  const {t} = useTranslation('manageChains');

  return (
    <View style={{alignItems: 'center'}}>
      <Image
        source={noConnectedAddresses}
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
