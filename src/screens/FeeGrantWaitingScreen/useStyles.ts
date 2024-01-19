import { makeStyle } from 'config/theme';

/**
 * Style hook for the Settings screen
 */
const useStyles = makeStyle(theme => ({
  root: {
    flex: 1,
    paddingHorizontal: theme.spacing.m,
  },
  icon: {
    height: 180,
    width: 180,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 150,
  },
  subtitle: {
    textAlign: 'center',
  },
  feeGrantReadyImage: {
    width: 180,
    height: 180,
  },
  loadingAnimation: {
    width: 180,
    height: 180,
  },
}));

export default useStyles;
