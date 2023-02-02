import { errorImage } from 'assets/images';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';

const NoTweets = () => {
  const { t } = useTranslation('connectApp');

  return (
    <View style={{ alignItems: 'center' }}>
      <Spacer paddingVertical={40} />
      <Image
        source={errorImage}
        style={{
          width: 190,
          height: 152,
          resizeMode: 'cover',
          marginBottom: 20,
        }}
      />

      <Typography.Body6>{t('noTweets')}</Typography.Body6>
    </View>
  );
};

export default NoTweets;
