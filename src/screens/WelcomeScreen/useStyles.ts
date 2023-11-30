import { makeStyle } from 'config/theme';

/**
 * Style hook for the Settings screen
 */
const useStyles = makeStyle(() => ({
  root: {
    flex: 1,
  },
  icon: {
    height: 180,
    width: 180,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 90,
  },
}));

export default useStyles;
