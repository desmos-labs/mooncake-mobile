import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Button, {ButtonMode} from 'components/Button';
import {useTranslation} from 'react-i18next';
import {cameraIcon, defaultProfilePic} from 'assets/images';
import useStoragePermissions from 'hooks/permissions/useStoragePermissions';
import {
  CameraRoll,
  PhotoIdentifier,
} from '@react-native-camera-roll/camera-roll';
import ImageButton from 'components/ImageButton';
import {View} from 'react-native';
import {useTheme} from 'react-native-paper';
import useStyles from './useStyles';
import GalleryButton from './GalleryButton';

type Props = {
  handlePressPost: () => void;

  handlePressGallery: () => void;

  handlePressCamera: () => void;
};

type ImageDto = {
  filename: string | null;
  uri: string;
  height: number;
  width: number;
  fileSize: number | null;
  playableDuration: number;
  timestamp: number;
  type: string;
  mimeType: string;
};

export const convertEdgeToImageDTO = (edges: PhotoIdentifier[]): ImageDto[] => {
  return edges.map(x => ({
    ...x.node.image,
    mimeType: x.node.image.mimeType,
    timestamp: x.node.timestamp,
    type: x.node.type,
  }));
};

const BottomBar = ({
  handlePressGallery,
  handlePressPost,
  handlePressCamera,
}: Props) => {
  const styles = useStyles();
  const theme = useTheme();
  const {t} = useTranslation();

  const [firstPhoto, setFirstPhoto] = React.useState<any>(undefined);

  const {permissionsState, requestStoragePermissions} = useStoragePermissions();

  React.useEffect(() => {
    requestStoragePermissions();
  }, []);

  React.useEffect(() => {
    if (permissionsState === 'granted') {
      CameraRoll.getPhotos({first: 2}).then(({edges}) => {
        const imageDto = convertEdgeToImageDTO(edges);
        setFirstPhoto({uri: imageDto[0]?.uri});
      });
    }
  }, [permissionsState]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.leftButtonGroup}>
        <GalleryButton
          image={firstPhoto || defaultProfilePic}
          handlePress={handlePressGallery}
        />

        <ImageButton
          image={cameraIcon}
          style={styles.cameraButton}
          onPress={handlePressCamera}
        />
      </View>

      <Button
        testID="postButton"
        size={32}
        textColor={theme.colors.white}
        backgroundColor={theme.colors.butterOrange01}
        mode={ButtonMode.CONTAINED}
        additionalStyle={{width: 58}}
        onPress={handlePressPost}>
        {t('postInteraction:post')}
      </Button>
    </SafeAreaView>
  );
};

export default BottomBar;
