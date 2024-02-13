import { makeStyle } from 'config/theme';

/**
 * Style hook for the Settings screen
 */
const useStyles = makeStyle(theme => ({
  root: {
    padding: theme.spacings.m,
  },
  input: {
    marginTop: theme.spacings.m,
    padding: theme.spacings.s,
    borderWidth: 0.5,
    borderColor: theme.colors.neutralVariants['600'],
  },
}));

export default useStyles;
