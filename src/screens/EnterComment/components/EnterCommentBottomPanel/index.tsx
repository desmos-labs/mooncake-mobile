import React from 'react';
import {KeyboardAvoidingView, Platform, View} from 'react-native';
import ImageButton from 'components/ImageButton';
import {cameraIcon, galleryIcon, tagIcon} from 'assets/images';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import EnvConfig from 'config/EnvConfig';
import RadialTextCounter from './RadialTextCounter';
import useStyles from './useStyles';

type Props = {
  handlePressGallery: () => void;

  handlePressCamera: () => void;

  handlePressMention: () => void;

  commentLength: number;
};

const EnterCommentBottomPanel = ({
  handlePressCamera,
  handlePressGallery,
  handlePressMention,
  commentLength,
}: Props) => {
  const styles = useStyles();

  const {bottom} = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={Platform.OS === 'ios' ? -bottom : 0}
      behavior={Platform.OS === 'ios' ? 'position' : undefined}>
      <SafeAreaView edges={['bottom']} style={styles.container}>
        <View style={styles.leftGroup}>
          <ImageButton
            hitSlopValue={8}
            onPress={handlePressGallery}
            image={galleryIcon}
            style={styles.imageButtonStyle}
          />
          <ImageButton
            hitSlopValue={8}
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
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default EnterCommentBottomPanel;
