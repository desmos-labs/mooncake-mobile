import {makeStyle} from 'config/theme';

/**
 * Style hook for the Settings screen
 */
const useStyles = makeStyle(theme => ({
  root: {
    paddingHorizontal: theme.spacing.m,
    paddingTop: theme.spacing.m,
    paddingBottom: theme.spacing.l,
  },
  scrollView: {
    flexGrow: 1,
    marginHorizontal: -theme.spacing.m,
  },
}));

export default useStyles;
