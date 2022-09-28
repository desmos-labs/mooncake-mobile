import {makeStyle} from 'config/theme';

/**
 * Style hook for the ResultModal screen
 */
const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.m,
  },
  innerContainer: {
    justifyContent: 'center',
    paddingHorizontal: 50,
    paddingTop: theme.spacing.l,
    paddingBottom: theme.spacing.xl,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
  },
  dismissButton: {
    alignSelf: 'flex-end',
    left: 28,
  },
  dismissButtonImage: {
    width: 11,
    height: 11,
    resizeMode: 'contain',
  },
  // default image dimensions are a bit strange,
  // may need standardize the dimensions if
  // the image gets changed
  image: {
    width: 126,
    height: 125,
    resizeMode: 'contain',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.l,
    alignSelf: 'center',
  },
  subtitleText: {
    marginTop: theme.spacing.s,
    marginBottom: theme.spacing.xl,
  },
  textStyle: {
    color: theme.colors.surfaceBlack,
    textAlign: 'center',
  },
  primaryButtonText: {
    color: theme.colors.white,
  },
  primaryButton: {
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
}));

export default useStyles;
