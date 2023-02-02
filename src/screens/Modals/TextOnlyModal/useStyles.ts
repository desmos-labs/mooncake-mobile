import { makeStyle } from 'config/theme';

/**
 * Style hook for the ResultModal screen
 */
const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: theme.spacing.m,
  },
  innerContainer: {
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.l,
    paddingTop: theme.spacing.m,
    paddingBottom: theme.spacing.m,
    backgroundColor: theme.colors.background,
    borderRadius: theme.roundness,
  },
  subtitleText: {
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.l,
  },
}));

export default useStyles;
