import {makeStyle} from 'config/theme';

/**
 * Style hook for the Settings screen
 */
const useStyles = makeStyle(() => ({
  root: {flex: 1},
  scrollViewOuter: {
    flex: 1,
  },
  scrollViewInner: {
    flexGrow: 1,
  },
}));

export default useStyles;
