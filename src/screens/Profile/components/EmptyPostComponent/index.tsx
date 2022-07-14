import React from 'react';
import Typography from 'components/Typography';
import {Image, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {errorImage} from 'assets/images';
import {useTheme} from 'react-native-paper';

const EmptyPostComponent = () => {
  const {t} = useTranslation('profile');
  const theme = useTheme();

  return (
    <View>
      <Image
        style={{
          width: 230,
          height: 116,
          resizeMode: 'contain',
          marginVertical: theme.spacing.m,
          alignSelf: 'center',
        }}
        source={errorImage}
      />

      <Typography.Subtitle1 style={{textAlign: 'center'}}>
        {t('userNoPosts')}
      </Typography.Subtitle1>
    </View>
  );
};

export default React.memo(EmptyPostComponent);
