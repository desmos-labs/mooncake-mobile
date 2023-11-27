import { makeStyle } from 'config/theme';

/**
 * Style hook for the searchbar component
 */
const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.colors.backgroundGrey,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    alignItems: 'center',
    borderRadius: theme.roundness,
  },
  magnifyingGlass: {
    width: 16,
    height: 16,
    marginRight: theme.spacing.s,
    tintColor: theme.colors.grey01,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: theme.colors.backgroundGrey,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 21,
    letterSpacing: 0.025,
    flexGrow: 1,
    height: 28,
    paddingHorizontal: 0,
    padding: 0,
  },
}));

export default useStyles;
