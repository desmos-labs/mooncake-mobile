import { makeStyle } from 'config/theme';

/**
 * Style hook for the searchbar component
 */
const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.colors.neutralVariants['100'],
    paddingHorizontal: theme.spacings.m,
    paddingVertical: theme.spacings.s,
    alignItems: 'center',
    borderRadius: 12,
  },
  magnifyingGlass: {
    width: 16,
    height: 16,
    marginRight: theme.spacings.s,
    tintColor: theme.colors.neutralVariants['600'],
    alignSelf: 'center',
  },
  input: {
    backgroundColor: theme.colors.neutralVariants['100'],
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 21,
    flexGrow: 1,
    height: 28,
    paddingHorizontal: 0,
    padding: 0,
  },
}));

export default useStyles;
