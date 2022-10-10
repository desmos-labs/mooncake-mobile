import React from 'react';
import {FlatList, TouchableOpacity} from 'react-native';
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
import {postAttachmentsState} from '@recoil/sharedPostState';
import {ImageMedia} from 'services/axios/requests/UploadMedia';
import _ from 'lodash';
import useImageFromDevice from 'hooks/useImageFromDevice';
import {Asset} from 'react-native-image-picker';
import useStoragePermissions from 'hooks/permissions/useStoragePermissions';
import useStyles from './useStyles';

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.CREATE_POST_CAMERA_ROLL
>;

/**
 * Converts an image selected using react-native-camera-roll into an ImageMedia type,
 * aligning the type for use with the rest of the app.
 */
const convertImageDtoToImageMedia = (imageDto: ImageDto): ImageMedia => {
  return {
    uri: imageDto.uri,
    type: imageDto.mimeType,
    fileName: imageDto.filename || '',
  };
};

const CreatePostCameraRoll = () => {
  const styles = useStyles();

  const {t} = useTranslation();

  const {goBack, replace} = useNavigation<NavProps['navigation']>();

  const setCommentAttachment = useSetRecoilState(postAttachmentsState);

  const {requestStoragePermissions} = useStoragePermissions();

  const imageFromCameraCallback = React.useCallback((asset: Asset) => {
    setCommentAttachment(asset);

    replace(ROUTES.ENTER_COMMENT, {
      isCreatePost: true,
    });
  }, []);

  const {imageFromCamera} = useImageFromDevice({
    onImageSelected: imageFromCameraCallback,
  });

  React.useEffect(() => {
    requestStoragePermissions();
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
    if (item.index === 0) {
      return <CameraButton onPress={imageFromCamera} />;
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
