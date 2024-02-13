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
    marginTop: theme.spacings.m,
  },
  attachmentContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: theme.spacings.m,
  },
}));

export default useStyles;
