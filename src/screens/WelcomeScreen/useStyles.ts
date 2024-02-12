import { makeStyle } from 'config/theme';

/**
 * Style hook for the Settings screen
 */
const useStyles = makeStyle(theme => ({
  root: {
    flex: 1,
    paddingVertical: theme.spacings.m,
  },
  container: {
    flex: 1,
    marginTop: 100,
    paddingHorizontal: theme.spacings.m,
  },
  image: { width: 120, height: 120, alignSelf: 'center' },
  button: {
    alignSelf: 'center',
    width: 180,
  },
}));

export default useStyles;
