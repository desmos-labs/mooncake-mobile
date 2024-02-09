import { makeStyle } from 'config/theme';

/**
 * Theme hook for the PostCard component
 */
const useStyles = makeStyle(theme => ({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  textContainer: {
    marginTop: theme.spacing.m,
  },
  attachmentContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.m,
  },
}));

export default useStyles;
