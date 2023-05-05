import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.m,
  },
  innerContainer: {
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 24,
    paddingVertical: theme.spacing.xl,
  },
  body: {
    lineHeight: 29,
    marginBottom: theme.spacing.l,
  },
}));

export default useStyles;
