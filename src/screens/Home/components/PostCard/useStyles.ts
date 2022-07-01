import {makeStyle} from 'config/theme';
import {StyleSheet} from 'react-native';

/**
 * Theme hook for the PostCard component
 */
const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    padding: theme.spacing.m,
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.l,
    ...StyleSheet.absoluteFillObject,
  },
  bottomGroup: {
    flexDirection: 'row',
    paddingVertical: theme.spacing.m,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  profileGroup: {
    flexDirection: 'row',
  },
  profileText: {
    color: theme.colors.font[5],
  },
  textStyle: {
    color: theme.colors.font[5],
    fontSize: 32,
  },
}));

export default useStyles;
