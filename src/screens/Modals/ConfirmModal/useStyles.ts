import { makeStyle } from 'config/theme';
import { scale } from 'react-native-size-matters';

/**
 * Style hook for the ResultModal screen
 */
const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    padding: theme.spacings.m,
    justifyContent: 'center',
  },
  innerContainer: {
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: theme.spacings.xl,
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
    color: theme.colors.neutralVariants['900'],
  },
  primaryButton: {
    alignSelf: 'stretch',
    backgroundColor: theme.colors.neutralVariants['900'],
  },
  secondaryButton: {
    alignSelf: 'stretch',
    marginBottom: theme.spacings.s,
  },
  imageStyle: {
    width: scale(120),
    height: scale(120),
    resizeMode: 'cover',
    alignSelf: 'center',
    paddingBottom: theme.spacings.xl,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inlineButton: {
    flex: 1,
  },
}));

export default useStyles;
