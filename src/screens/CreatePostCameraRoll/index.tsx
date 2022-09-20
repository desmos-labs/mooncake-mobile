import React from 'react';
import {FlatList, Platform, TouchableOpacity} from 'react-native';
import useGallery, {ImageDto} from 'screens/CreatePostCameraRoll/useGallery';
import CameraRollItem from 'screens/CreatePostCameraRoll/components/CameraRollItem';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import {useNavigation} from '@react-navigation/native';
import ROUTES from 'navigation/routes';
import Typography from 'components/Typography';
import {useTranslation} from 'react-i18next';
import CameraButton from 'screens/CreatePostCameraRoll/components/CameraRollItem/CameraButton';
import {useSetRecoilState} from 'recoil';
import {commentAttachmentsState} from '@recoil/sharedCommentState';
import {ImageMedia} from 'services/axios/requests/UploadMedia';
import {PERMISSIONS, requestMultiple} from 'react-native-permissions';
import _ from 'lodash';
import useStyles from './useStyles';

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.CREATE_POST_CAMERA_ROLL
>;

const convertImageDtoToImageMedia = (imageDto: ImageDto): ImageMedia => {
  return {
    uri: imageDto.uri,
    type: imageDto.mimeType,
    // TODO: fixme
    fileName: imageDto.filename || '',
  };
};

const CreatePostCameraRoll = () => {
  const styles = useStyles();

  const {t} = useTranslation();

  const {goBack, replace} = useNavigation<NavProps['navigation']>();

  const setCommentAttachment = useSetRecoilState(commentAttachmentsState);

  React.useEffect(() => {
    const requestPermissions = async () => {
      const permission: any = Platform.select({
        android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        ios: PERMISSIONS.IOS.MEDIA_LIBRARY,
      });

      // @ts-ignore
      const grantedPermissions = await requestMultiple([permission]);

      if (grantedPermissions[permission] !== 'granted') goBack();
    };

    requestPermissions();
  }, []);

  const {photos, hasNextPage, loadNextPagePictures, isLoadingNextPage} =
    useGallery({
      pageSize: 60,
      mimeTypeFilter: [
        'image/jpeg',
        'image/png',
        // 'image/heif',
        // 'image/heic',
        // 'image/heif-sequence',
        // 'image/heic-sequence',
      ],
    });

  const handleImagePress = React.useCallback(
    _.throttle((imageDto: ImageDto) => {
      // convert selected imageDto into ImageMedia type
      const convertedImage = convertImageDtoToImageMedia(imageDto);

      setCommentAttachment(convertedImage);

      replace(ROUTES.ENTER_COMMENT, {
        isCreatePost: true,
      });
    }, 1500),
    [],
  );

  const renderItem = React.useCallback((item: any) => {
    console.log(item, item.index);
    if (item.index === 0) {
      return (
        <CameraButton
          onPress={() => {
            console.log('hello camera');
          }}
        />
      );
    }
    return (
      <CameraRollItem
        imageSrc={{uri: item.item.uri}}
        handlePress={() => handleImagePress(item.item)}
      />
    );
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={goBack}>
        <Typography.Subtitle3 style={styles.cancelText}>
          {t('common:cancel')}
        </Typography.Subtitle3>
      </TouchableOpacity>
      <FlatList
        numColumns={4}
        style={styles.flatList}
        data={photos ? [0, ...(photos as any[])] : [0]}
        renderItem={renderItem}
        columnWrapperStyle={styles.columnWrapperStyle}
        contentContainerStyle={styles.contentContainerStyle}
        onEndReachedThreshold={0.25}
        onEndReached={() => {
          if (hasNextPage && !isLoadingNextPage) loadNextPagePictures();
        }}
      />
    </SafeAreaView>
  );
};

export default CreatePostCameraRoll;
