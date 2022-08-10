import {makeStyle} from 'config/theme';
import {StyleSheet} from 'react-native';

/**
 * Style hook for the Authorization screen
 */
const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  innerContainer: {
    padding: theme.spacing.m,
    backgroundColor: theme.colors.white,
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
  },
  bar: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    backgroundColor: '#DEDEDE',
  },
  textStyle: {
    color: theme.colors.surfaceBlack,
    textAlign: 'center',
  },
  imageStyle: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
    marginVertical: theme.spacing.m,
    alignSelf: 'center',
  },
  dismissTouchable: {
    ...StyleSheet.absoluteFillObject,
  },
}));

export default useStyles;
