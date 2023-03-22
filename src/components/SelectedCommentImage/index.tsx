import React from 'react';
import {
  Image,
  ImageProps,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { whiteCross } from 'assets/images';
import { makeStyle } from 'config/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'native-base';
import { UploadAssetType } from 'services/axios/requests/UploadMedia';
import CommonStyles from 'config/theme/CommonStyles';

interface Props extends Omit<ImageProps, 'style' | 'source'> {
  source: UploadAssetType | undefined;
  handlePress: (source: UploadAssetType) => void;
}

const COMPONENT_SIZE = 100;

/**
 * Component that represents a single image that was selected to be added to a comment.
 * @constructor
 */
const SelectedCommentImage = (props: Props) => {
  const { handlePress, ...rest } = props;
  const styles = useStyles();
  const theme = useTheme();
  const { bottom } = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      // 116 is the width of this component with vertical margin (100 + 8 + 8)
      keyboardVerticalOffset={
        Platform.OS === 'ios' ? bottom + (theme.spacing.m as number) * 2 + COMPONENT_SIZE : 0
      }
      behavior={Platform.OS === 'ios' ? 'position' : undefined}>
      {/* Invisible view acts as a placeholder, otherwise the component will appear */}
      {/* underneath the keyboard if an image is selected while the keyboard is expanded */}
      {!rest.source ? (
        <View style={CommonStyles.opacity[0]} />
      ) : (
        <TouchableOpacity style={styles.container} onPress={() => handlePress(rest.source!)}>
          <Image {...rest} style={styles.imageStyle} source={rest.source} />
          <View style={styles.closeButtonContainer}>
            <Image style={styles.closeButton} source={whiteCross} />
          </View>
        </TouchableOpacity>
      )}
    </KeyboardAvoidingView>
  );
};

const useStyles = makeStyle(theme => ({
  closeButton: {
    height: 12,
    resizeMode: 'contain',
    width: 12,
  },
  closeButtonContainer: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
    padding: 7.5,
    position: 'absolute',
    right: 8,
    top: 8,
  },
  container: {
    overflow: 'hidden',
    borderRadius: 12,
    height: COMPONENT_SIZE,
    width: COMPONENT_SIZE,
    marginHorizontal: theme.spacing.m,
    zIndex: 2,
  },
  imageStyle: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
}));

export default SelectedCommentImage;
