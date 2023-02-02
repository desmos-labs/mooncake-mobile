import { makeStyle } from 'config/theme';

/**
 * Style hook for the Settings screen
 */
const useStyles = makeStyle(theme => ({
  root: {
    padding: theme.spacing.m,
  },
  title: {
    marginBottom: 24,
  },
  scrollViewOuter: {
    margin: -20,
  },
  scrollViewInner: {
    padding: 20,
    flexGrow: 1,
  },
  spacer: {
    marginBottom: 24,
  },
}));

export default useStyles;
