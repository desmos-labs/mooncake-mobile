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
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: theme.spacing.xl,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
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
    textAlign: 'center',
  },
  primaryButtonText: {
    color: theme.colors.white,
  },
  secondaryButtonText: {
    color: theme.colors.surfaceBlack,
  },
  primaryButton: {
    alignSelf: 'stretch',
    marginBottom: theme.spacing.l,
    backgroundColor: theme.colors.surfaceBlack,
  },
  secondaryButton: {
    alignSelf: 'stretch',
    marginBottom: theme.spacing.s,
  },
  imageStyle: {
    width: 126,
    height: 125,
    resizeMode: 'contain',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.l,
    alignSelf: 'center',
  },
}));

export default useStyles;
