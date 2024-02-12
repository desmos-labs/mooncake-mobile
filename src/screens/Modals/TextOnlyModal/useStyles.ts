import { makeStyle } from 'config/theme';

/**
 * Style hook for the ResultModal screen
 */
const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: theme.spacings.m,
  },
  innerContainer: {
    justifyContent: 'center',
    paddingHorizontal: theme.spacings.l,
    paddingTop: theme.spacings.m,
    paddingBottom: theme.spacings.m,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
  },
  subtitleText: {
    marginTop: theme.spacings.m,
    marginBottom: theme.spacings.l,
  },
  image: {
    width: 116,
    height: 116,
    alignSelf: 'center',
  },
}));

export default useStyles;
