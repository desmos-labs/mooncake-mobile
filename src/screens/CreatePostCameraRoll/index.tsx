import React from 'react';
import {FlatList, TouchableOpacity} from 'react-native';
import useGallery from 'screens/CreatePostCameraRoll/useGallery';
import CameraRollItem from 'screens/CreatePostCameraRoll/components/CameraRollItem';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import {useNavigation} from '@react-navigation/native';
import ROUTES from 'navigation/routes';
import Typography from 'components/Typography';
import {useTranslation} from 'react-i18next';
import useStyles from './useStyles';

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.CREATE_POST_CAMERA_ROLL
>;

const CreatePostCameraRoll = () => {
  const styles = useStyles();

  const {t} = useTranslation();

  const {goBack} = useNavigation<NavProps['navigation']>();

  const {photos} = useGallery({
    pageSize: 30,
    mimeTypeFilter: [
      'image/jpeg',
      'image/png',
      'image/heif',
      'image/heic',
      'image/heif-sequence',
      'image/heic-sequence',
    ],
  });

  const handleImagePress = React.useCallback((imageDto: string) => {
    console.log(imageDto);
  }, []);

  const renderItem = (item: any) => {
    return (
      <CameraRollItem
        imageSrc={{uri: item.item.uri}}
        handlePress={() => handleImagePress(item.item)}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={goBack}>
        <Typography.Subtitle3 style={styles.cancelText}>
          {t('common:cancel')}
        </Typography.Subtitle3>
      </TouchableOpacity>
      <FlatList
        numColumns={4}
        data={photos}
        renderItem={renderItem}
        columnWrapperStyle={styles.columnWrapperStyle}
        contentContainerStyle={styles.contentContainerStyle}
      />
    </SafeAreaView>
  );
};

export default CreatePostCameraRoll;
