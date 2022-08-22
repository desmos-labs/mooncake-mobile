import {makeStyle} from 'config/theme';
import {StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

/**
 * Style hook for the ProfileHeader component
 */
const useStyles = makeStyle(theme => {
  const {top} = useSafeAreaInsets();

  return {
    container: {
      padding: theme.spacing.m,
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    background: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 2,
      backgroundColor: 'grey',
    },
    buttonWrapper: {
      position: 'absolute',
      top: 16,
      zIndex: 2,
    },
    buttonStyle: {
      width: 32,
      height: 32,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    usernameStyle: {
      color: theme.colors.white,
      textAlign: 'center',
    },
    usernameContainerStyle: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      justifyContent: 'center',
    },
    blurContainer: {
      ...StyleSheet.absoluteFillObject,
      overflow: 'hidden',
      top: -top,
    },
    safeAreaView: {
      position: 'absolute',
      width: '100%',
    },
  };
});

export default useStyles;
