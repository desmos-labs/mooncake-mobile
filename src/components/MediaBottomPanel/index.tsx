import { cameraIcon, galleryIcon } from 'assets/images';
import ImageButton from 'components/ImageButton';
import RadialTextCounter from 'components/RadialTextCounter';
import { CameraType } from 'expo-image-picker';
import useTakePicture, { TakePictureActionResults } from 'hooks/camera/useTakePicture';
import usePostsParams from 'hooks/posts/usePostsParams';
import useImageFromDevice from 'hooks/useImageFromDevice';
import useOpenPictureEditor from 'hooks/useOpenPictureEditor';
import { useTheme } from 'native-base';
import React from 'react';
import { ImageStyle, KeyboardAvoidingView, Platform, StyleProp, View } from 'react-native';
import useStyles from './useStyles';

export type OnImageSelectedCallback = (
  editedPicturePath: string,
  dimensions: { width: number; height: number },
  mimeType: string,
) => void;

type MediaBottomPanelProps = {
  /**
   * Actual length of the comment
   */
  commentLength: number;
  /**
   * If the image is selected
   */
  imageSelected: boolean;
  /**
   * Callback to handle when the user selects an image
   */
  onImageSelected: OnImageSelectedCallback;
  /**
   * Optional style
   */
  style?: StyleProp<ImageStyle>;
  /**
   * Optional right component (usefull for the EnterCommentBottomBar)
   */
  rightComponent?: React.ReactNode;
  /**
   * Is the app processing a comment?
   */
  loading?: boolean;
  /**
   * Camera that will be used to take a picture.
   * Defaults to <code>CameraType.front</code>.
   */
  readonly cameraType?: CameraType;
};

const MediaBottomPanel = ({
  imageSelected,
  commentLength,
  rightComponent,
  style,
  loading,
  onImageSelected,
  cameraType,
}: MediaBottomPanelProps) => {
  const styles = useStyles();
  const theme = useTheme();
  const { params } = usePostsParams();

  // --------------------------------------
  // ----- Hooks
  // --------------------------------------

  const { editPostPicture } = useOpenPictureEditor();
  const { imageFromLibrary } = useImageFromDevice({
    onImageSelected: React.useCallback(
      (imageUri: string) => {
        editPostPicture(imageUri, onImageSelected);
      },
      [editPostPicture, onImageSelected],
    ),
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
        <View style={styles.leftGroup}>
          <ImageButton
            accessibilityLabel="use image from gallery"
            hitSlopValue={8}
            disabled={imageSelected}
            onPress={handlePressGallery}
            image={galleryIcon}
            style={styles.imageButtonStyle}
            tintColor={theme.colors.darkGrey}
          />
          <ImageButton
            accessibilityLabel="use image from camera"
            hitSlopValue={8}
            disabled={imageSelected}
            onPress={handlePressCamera}
            image={cameraIcon}
            style={styles.imageButtonStyle}
            tintColor={theme.colors.darkGrey}
          />
        </View>
        <View style={styles.rightGroup}>
          {!loading && <RadialTextCounter max={params.maxTextLength} current={commentLength} />}
          {rightComponent}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MediaBottomPanel;
