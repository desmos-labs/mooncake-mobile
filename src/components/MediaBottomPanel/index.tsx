import {cameraIcon, galleryIcon, tagIcon} from 'assets/images';
import ImageButton from 'components/ImageButton';
import RadialTextCounter from 'components/RadialTextCounter';
import EnvConfig from 'config/EnvConfig';
import React from 'react';
import {
  ImageStyle,
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  View,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import useStyles from './useStyles';

type Props = {
  /**
   * Action to execute when the gallery icon is pressed
   */
  handlePressGallery: () => void;
  /**
   * Action to execute when the camera icon is pressed
   */
  handlePressCamera: () => void;
  /**
   * Action to execute when the mention icon is pressed
   */
  handlePressMention: () => void;
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
};

const MediaBottomPanel = ({
  handlePressCamera,
  handlePressGallery,
  handlePressMention,
  commentLength,
  imageSelected,
  rightComponent,
  style,
}: Props) => {
  const styles = useStyles();

  const {bottom} = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={Platform.OS === 'ios' ? -bottom : 0}
      behavior={Platform.OS === 'ios' ? 'position' : undefined}>
      <SafeAreaView edges={['bottom']} style={[style, styles.container]}>
        <View style={styles.leftGroup}>
          <ImageButton
            hitSlopValue={8}
            disabled={imageSelected}
            onPress={handlePressGallery}
            image={galleryIcon}
            style={styles.imageButtonStyle}
          />
          <ImageButton
            hitSlopValue={8}
            disabled={imageSelected}
            onPress={handlePressCamera}
            image={cameraIcon}
            style={styles.imageButtonStyle}
          />
          <ImageButton
            hitSlopValue={8}
            onPress={handlePressMention}
            image={tagIcon}
            style={styles.imageButtonStyle}
          />
        </View>

        <View style={styles.rightGroup}>
          <RadialTextCounter
            max={EnvConfig.MAX_COMMENT_LENGTH}
            current={commentLength}
          />
          {rightComponent}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default MediaBottomPanel;
