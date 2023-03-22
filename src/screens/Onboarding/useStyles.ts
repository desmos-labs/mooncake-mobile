import { makeStyle } from 'config/theme';

/**
 * Style hook for the Settings screen
 */
const useStyles = makeStyle(theme => ({
  root: { flex: 1, paddingTop: theme.spacing.m },
  itemView: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
  },
  image: { height: 374, width: 374 },
  dotView: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  dotStyle: {
    width: 8,
    height: 8,
    marginHorizontal: 6,
  },
  topBar: {
    zIndex: 2,
  },
}));

export default useStyles;
