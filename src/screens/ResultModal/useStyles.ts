import {makeStyle} from 'config/theme';

/**
 * Style hook for the ResultModal screen
 */
const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.l,
    paddingTop: theme.spacing.m,
    paddingBottom: theme.spacing.l,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
  },
  dismissButton: {
    alignSelf: 'flex-end',
    left: 4,
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
    width: 181,
    height: 103,
    resizeMode: 'contain',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.l,
  },
  subtitleText: {
    marginTop: theme.spacing.s,
    marginBottom: theme.spacing.xl,
  },
  primaryButtonText: {
    color: theme.colors.font[5],
  },
  primaryButton: {
    alignSelf: 'stretch',
  },
}));

export default useStyles;
