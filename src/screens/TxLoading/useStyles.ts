import { makeStyle } from 'config/theme';

/**
 * Style hook for the Settings screen
 */
const useStyles = makeStyle(theme => ({
  root: {
    flex: 1,
    alignItems: 'center',
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 90,
  },
  animation: {
    width: 180,
    height: 180,
  },
  errorText: {
    color: theme.colors.error,
  },
  bodyText: {
    paddingHorizontal: 20,
    textAlign: 'center',
  },
}));

export default useStyles;
