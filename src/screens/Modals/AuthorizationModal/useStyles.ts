import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.s,
  },
  innerContainer: {
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.m,
  },
}));

export default useStyles;
