import { cameraIcon, galleryIcon } from 'assets/images';
import ImageButton from 'components/ImageButton';
import RadialTextCounter from 'components/RadialTextCounter';
import usePostsParams from 'hooks/posts/usePostsParams';
import { useTheme } from 'native-base';
import React from 'react';
import { ImageStyle, KeyboardAvoidingView, Platform, StyleProp, View } from 'react-native';
import useStyles from './useStyles';

type MediaBottomPanelProps = {
  /**
   * Action to execute when the gallery icon is pressed
   */
  handlePressGallery: () => void;
  /**
   * Action to execute when the camera icon is pressed
   */
  handlePressCamera: () => void;
  /**
   * Actual length of the comment
   */
  commentLength: number;
  /**
   * If the image is selected
   */
  imageSelected: boolean;
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
};

const MediaBottomPanel = ({
  handlePressCamera,
  handlePressGallery,
  commentLength,
  imageSelected,
  rightComponent,
  style,
  loading,
}: MediaBottomPanelProps) => {
  const styles = useStyles();
  const theme = useTheme();
  const { params } = usePostsParams();

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
