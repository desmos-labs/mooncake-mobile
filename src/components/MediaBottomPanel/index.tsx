import { useTheme } from '@react-navigation/native';
import { cameraIcon, galleryIcon } from 'assets/images';
import ImageButton from 'components/ImageButton';
import RadialTextCounter from 'components/RadialTextCounter';
import { CameraType } from 'expo-image-picker';
import useTakePicture, { TakePictureActionResults } from 'hooks/camera/useTakePicture';
import usePostsParams from 'hooks/posts/usePostsParams';
import useImageFromDevice from 'hooks/useImageFromDevice';
import useOpenPictureEditor from 'hooks/useOpenPictureEditor';
import React from 'react';
import { ImageStyle, KeyboardAvoidingView, Platform, StyleProp, View } from 'react-native';
import useStyles from './useStyles';

export type OnImageSelectedCallback = (
  editedPicturePath: string,
  dimensions: { width: number; height: number },
  mimeType?: string,
) => void;

type MediaBottomPanelProps = {
  /**
   * Actual length of the post
   */
  readonly textLength: number;
  /**
   * If the image is selected
   */
  readonly imageSelected: boolean;
  /**
   * Callback to handle when the user selects an image
   */
  readonly onImageSelected: OnImageSelectedCallback;
  /**
   * Optional style
   */
  readonly style?: StyleProp<ImageStyle>;
  /**
   * Optional right component (usefull for the EnterCommentBottomBar)
   */
  readonly rightComponent?: React.ReactNode;
  /**
   * Is the app processing a comment?
   */
  readonly loading?: boolean;
  /**
   * Camera that will be used to take a picture.
   * Defaults to <code>CameraType.front</code>.
   */
  readonly cameraType?: CameraType;
  /**
   * If true, the user can select an image from the device.
   */
  readonly allowPictures?: boolean;
};

const MediaBottomPanel = ({
  imageSelected,
  textLength,
  rightComponent,
  style,
  loading,
  onImageSelected,
  cameraType,
  allowPictures = true,
}: MediaBottomPanelProps) => {
  const styles = useStyles();
  const theme = useTheme();
  const { params } = usePostsParams();
  // --------------------------------------
  // ----- Hooks
  // --------------------------------------

  const { editPostPicture } = useOpenPictureEditor();
  const { imageFromLibrary } = useImageFromDevice({
    onImageSelected: (imageUri, width, height, mimeType) =>
      onImageSelected(imageUri, { width, height }, mimeType),
  });
  const takePhoto = useTakePicture();

  // --------------------------------------
  // ----- Callbacks
  // --------------------------------------

  const handlePressGallery = React.useCallback(() => {
    imageFromLibrary();
  }, [imageFromLibrary]);

  const handlePressCamera = React.useCallback(() => {
    takePhoto(cameraType ?? CameraType.front).then(result => {
      if (result?.status === TakePictureActionResults.Taken) {
        const imageUri = result.uri;
        editPostPicture(imageUri, onImageSelected);
      }
    });
  }, [cameraType, editPostPicture, onImageSelected, takePhoto]);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : undefined}>
      <View style={[style, styles.container]}>
        {allowPictures && (
          <View style={styles.leftGroup}>
            <ImageButton
              accessibilityLabel="use image from gallery"
              hitSlopValue={8}
              disabled={imageSelected}
              onPress={handlePressGallery}
              image={galleryIcon}
              style={styles.imageButtonStyle}
              tintColor={theme.colors.neutralVariants['700']}
            />
            <ImageButton
              accessibilityLabel="use image from camera"
              hitSlopValue={8}
              disabled={imageSelected}
              onPress={handlePressCamera}
              image={cameraIcon}
              style={styles.imageButtonStyle}
              tintColor={theme.colors.neutralVariants['700']}
            />
          </View>
        )}
        <View style={styles.rightGroup}>
          {!loading && (
            <RadialTextCounter
              max={params.maxTextLength}
              current={textLength}
              customFillColor={theme.colors.primary}
              size={styles.imageButtonStyle.width}
            />
          )}
          {rightComponent}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MediaBottomPanel;
