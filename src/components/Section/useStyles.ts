import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  title: {
    color: theme.colors.butterOrange01,
    paddingVertical: theme.spacing.s,
  },
  container: {
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.background,
  },
  innerContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
  },
}));

export default useStyles;
