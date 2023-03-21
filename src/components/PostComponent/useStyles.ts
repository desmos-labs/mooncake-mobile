import { makeStyle } from 'config/theme';

/**
 * Theme hook for the PostCard component
 */
const useStyles = makeStyle(theme => ({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    paddingVertical: theme.spacing.m,
    alignSelf: 'flex-start',
  },
}));

export default useStyles;
