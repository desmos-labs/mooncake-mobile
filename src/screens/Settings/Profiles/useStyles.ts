import {makeStyle} from 'config/theme';

/**
 * Style hook for the Settings screen
 */
const useStyles = makeStyle(theme => ({
  root: {
    padding: theme.spacing.m,
  },
  signOutButton: {
    marginTop: theme.spacing.l,
  },
  scrollViewOuter: {
    margin: -20,
  },
  scrollViewInner: {
    padding: 20,
  },
}));

export default useStyles;
