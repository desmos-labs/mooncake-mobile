import { makeStyle } from 'config/theme';

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
    borderColor: theme.colors.lightGrey01,
    borderWidth: 0.5,
  },
  magnifyingGlass: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    marginRight: theme.spacing.s,
    tintColor: theme.colors.grey02,
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
