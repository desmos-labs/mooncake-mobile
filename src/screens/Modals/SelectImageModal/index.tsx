import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { cameraIcon, galleryIcon } from 'assets/images';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import { Image } from 'expo-image';
import { Divider } from 'native-base';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import useStyles from './useStyles';

export interface SelectImageModalParams {
  onPressTakePhoto: () => void;
  onPressSelectImage: () => void;
}

type NavProps = NativeStackScreenProps<RootNavigatorParamList, ROUTES.SELECT_IMAGE_MODAL>;

const SelectImageModal = () => {
  const { params } = useRoute<NavProps['route']>();
  const { goBack } = useNavigation<NavProps['navigation']>();
  const styles = useStyles();
  const { t } = useTranslation('modals');

  const onPressTakePhotoWrapper = React.useCallback(async () => {
    await goBack();
    setTimeout(() => params.onPressTakePhoto(), 100);
  }, [goBack, params]);

  const onPressSelectImageWrapper = React.useCallback(async () => {
    await goBack();
    setTimeout(() => params.onPressSelectImage(), 100);
  }, [goBack, params]);

  return (
    <TouchableOpacity activeOpacity={1} style={styles.root} onPress={() => goBack()}>
      <View style={styles.contentView}>
        <TouchableOpacity onPress={onPressTakePhotoWrapper} style={styles.pressable}>
          <Image source={cameraIcon} style={styles.image} />
          <Typography.Body5>{t('take a photo')}</Typography.Body5>
        </TouchableOpacity>
        <Spacer paddingVertical="l">
          <Divider />
        </Spacer>
        <TouchableOpacity onPress={onPressSelectImageWrapper} style={styles.pressable}>
          <Image source={galleryIcon} style={styles.image} />
          <Typography.Body5>{t('choose from gallery')}</Typography.Body5>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default SelectImageModal;
