import {makeStyle} from 'config/theme';

/**
 * Style hook for the ResultModal screen
 */
const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    padding: theme.spacing.m,
    justifyContent: 'center',
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
    backgroundColor: theme.colors.surfaceBlack,
  },
  secondaryButton: {
    alignSelf: 'stretch',
    marginBottom: theme.spacing.s,
  },
  imageStyle: {
    width: 150,
    height: 180,
    resizeMode: 'cover',
    alignSelf: 'center',
    paddingBottom: theme.spacing.xl,
  },
}));

export default useStyles;
