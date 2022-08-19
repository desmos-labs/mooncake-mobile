import {makeStyle} from 'config/theme';
import {StyleSheet} from 'react-native';

/**
 * Style hook for the ProfileTopButtons component
 */
const useStyles = makeStyle(theme => ({
  container: {
    padding: theme.spacing.m,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  topLayer: {
    ...StyleSheet.absoluteFillObject,
    bottom: 0,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
    backgroundColor: 'grey',
  },
  buttonStyle: {
    width: 32,
    height: 32,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));

export default useStyles;
