// Safe to ignore as additional common styles will be added here
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { TextStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import { ViewStyle } from 'react-native';

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
};

/**
 * A map of commonly used overflow values.
 */
const overflow: { visible: StyleProp<ViewStyle> } = {
  visible: {
    overflow: 'visible',
  },
};

const CommonStyles = {
  flex,
  flexGrow,
  textAlign,
  opacity,
  overflow,
  flexDirection,
};

export default CommonStyles;
