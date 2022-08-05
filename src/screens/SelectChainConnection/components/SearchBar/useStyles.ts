import {makeStyle} from 'config/theme';

/**
 * Style hook for the searchbar component
 */
const useStyles = makeStyle(theme => ({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    alignItems: 'center',
    borderRadius: 8,
  },
  magnifyingGlass: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: theme.spacing.s,
    tintColor: theme.colors.grey02,
  },
}));

export default useStyles;
