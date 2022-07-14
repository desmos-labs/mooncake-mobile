import {makeStyle} from 'config/theme';

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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.m,
    paddingBottom: theme.spacing.l,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
  },
  dismissButton: {
    alignSelf: 'flex-end',
    left: 10,
  },
  dismissButtonImage: {
    width: 11,
    height: 11,
    resizeMode: 'contain',
  },
  subtitleText: {
    marginTop: theme.spacing.l,
    marginBottom: theme.spacing.xl,
  },
  primaryButtonText: {
    color: theme.colors.font[5],
  },
  secondaryButtonText: {
    color: theme.colors.font[1],
  },
  primaryButton: {
    alignSelf: 'stretch',
    marginBottom: theme.spacing.m,
  },
}));

export default useStyles;
