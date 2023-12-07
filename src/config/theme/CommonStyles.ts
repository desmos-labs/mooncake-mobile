// Safe to ignore as additional common styles will be added here
import { Platform, ViewStyle } from 'react-native';
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { TextStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

/**
 * A map of commonly used flex values.
 */
const flex = {
  1: {
    flex: 1,
  },
};

/**
 * A map of commonly used flexGrow values
 */
const flexGrow = {
  1: {
    flexGrow: 1,
  },
};

/**
 * A map of commonly used flexDirection values.
 */
const flexDirection: {
  row: StyleProp<ViewStyle>;
} = {
  row: {
    flexDirection: 'row',
  },
};

/**
 * A mao of commonly used textAlign values.
 */
const textAlign: {
  // there has to be a better way to do this...
  center: StyleProp<TextStyle>;
  left: StyleProp<TextStyle>;
} = {
  center: {
    textAlign: 'center',
  },
  left: {
    textAlign: 'left',
  },
};

/**
 * A map of commonly used opacity values.
 */
const opacity = {
  0: {
    opacity: 0,
  },
  50: {
    opacity: 0.5,
  },
};

/**
 * A map of commonly used overflow values.
 */
const overflow: { visible: StyleProp<ViewStyle> } = {
  visible: {
    overflow: 'visible',
  },
};

/**
 * A map of commonly used absolute values
 */
const position: { absolute: StyleProp<ViewStyle> } = {
  absolute: {
    position: 'absolute',
  },
};

const shadows = {
  Shadows: {
    // Shadows
    shadowColor: Platform.OS === 'ios' ? 'rgba(10, 10, 10, 0.1)' : 'rgba(10, 10, 10, 0.5)',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
  },
};

const CommonStyles = {
  flex,
  flexGrow,
  textAlign,
  opacity,
  overflow,
  flexDirection,
  position,
  shadows,
};

export default CommonStyles;
