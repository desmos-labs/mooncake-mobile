import {makeStyle} from 'config/theme';
import {Dimensions} from 'react-native';

/**
 * Theme hook for the PostCard component
 */
const useStyles = makeStyle(theme => ({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    backgroundColor: theme.colors.butterYellow01,
    width: Dimensions.get('window').width,
    height: 630,
    paddingHorizontal: theme.spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    color: theme.colors.white,
    fontSize: 32,
  },
}));

export default useStyles;
