import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Button from 'components/Button';
import {useTranslation} from 'react-i18next';
import {defaultProfilePic} from 'assets/images';
import useStyles from './useStyles';
import GalleryButton from './GalleryButton';

type Props = {
  handlePressPost: () => void;

  handlePressGallery: () => void;
};

const BottomBar = ({handlePressGallery, handlePressPost}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <GalleryButton
        image={defaultProfilePic}
        handlePress={handlePressGallery}
      />

      <Button
        containerStyle={styles.postButton}
        mode="gradientFilled"
        onPress={handlePressPost}>
        {t('postInteraction:post')}
      </Button>
    </SafeAreaView>
  );
};

export default BottomBar;
