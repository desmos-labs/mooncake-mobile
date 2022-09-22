import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {cameraIcon} from 'assets/images';
import {useTheme} from 'react-native-paper';
import Typography from 'components/Typography';
import {useTranslation} from 'react-i18next';
import styles from './styles';

type Props = {
  onPress: () => void;
};

const CameraButton = ({onPress}: Props) => {
  const theme = useTheme();
  const {t} = useTranslation();

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.imageStyle,
          {
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          },
        ]}>
        <Image
          source={cameraIcon}
          style={{
            width: 40,
            height: 40,
            resizeMode: 'contain',
            tintColor: theme.colors.white,
          }}
        />

        <Typography.Body7 style={{color: 'white'}}>
          {t('common:camera')}
        </Typography.Body7>
      </View>
    </TouchableOpacity>
  );
};

export default CameraButton;
