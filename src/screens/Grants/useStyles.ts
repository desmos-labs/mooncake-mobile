import {makeStyle} from 'config/theme';

/**
 * Style hook for the Settings screen
 */
const useStyles = makeStyle(theme => ({
  root: {
    padding: theme.spacing.m,
  },
  scrollView: {
    flexGrow: 1,
    marginHorizontal: -theme.spacing.m,
  },
}));

export default useStyles;
