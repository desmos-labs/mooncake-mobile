import { makeStyle } from 'config/theme';

/**
 * Style hook for the searchbar component
 */
const useStyles = makeStyle(theme => ({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacings.m,
    paddingVertical: theme.spacings.s,
    alignItems: 'center',
    borderRadius: 8,
    borderColor: theme.colors.neutralVariants['600'],
    borderWidth: 0.5,
  },
  magnifyingGlass: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    marginRight: theme.spacings.s,
    tintColor: theme.colors.neutralVariants['600'],
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
