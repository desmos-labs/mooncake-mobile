import {makeStyle} from 'config/theme';

/**
 * Style hook for the searchbar component
 */
const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.colors.backgroundGrey,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: theme.spacing.s,
  },
  magnifyingGlass: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    marginRight: theme.spacing.s,
    tintColor: theme.colors.grey01,
  },
  input: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 21,
    letterSpacing: 0.025,
    textAlign: 'left',
  },
}));

export default useStyles;
