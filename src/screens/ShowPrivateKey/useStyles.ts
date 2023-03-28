import { makeStyle } from 'config/theme';

/**
 * Style hook for the Settings screen
 */
const useStyles = makeStyle(theme => ({
  root: {
    padding: theme.spacing.m,
  },
  input: {
    marginTop: theme.spacing.m,
    padding: theme.spacing.s,
    borderWidth: 0.5,
    borderColor: theme.colors.lightGrey01,
  },
}));

export default useStyles;
