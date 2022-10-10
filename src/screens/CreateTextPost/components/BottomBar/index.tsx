import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Button from 'components/Button';
import {useTranslation} from 'react-i18next';
import {defaultProfilePic} from 'assets/images';
import useStoragePermissions from 'hooks/permissions/useStoragePermissions';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {convertEdgeToImageDTO} from 'screens/CreatePostCameraRoll/useGallery';
import useStyles from './useStyles';
import GalleryButton from './GalleryButton';

type Props = {
  handlePressPost: () => void;

  handlePressGallery: () => void;
};

const BottomBar = ({handlePressGallery, handlePressPost}: Props) => {
  const styles = useStyles();
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
      <GalleryButton
        image={firstPhoto || defaultProfilePic}
        handlePress={handlePressGallery}
      />

      <Button
        style={styles.postButton}
        mode="contained"
        labelStyle={{
          lineHeight: 34.7,
        }}
        onPress={handlePressPost}>
        {t('postInteraction:post')}
      </Button>
    </SafeAreaView>
  );
};

export default BottomBar;
