import { makeStyle } from 'config/theme';

/**
 * Style hook for the Settings screen
 */
const useStyles = makeStyle(theme => ({
  root: {
    flex: 1,
    padding: theme.spacing.m,
  },
  image: { width: 120, height: 120, alignSelf: 'center' },
}));

export default useStyles;
