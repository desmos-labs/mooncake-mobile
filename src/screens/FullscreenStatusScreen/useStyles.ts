import { makeStyle } from 'config/theme';

/**
 * Style hook for the Settings screen
 */
const useStyles = makeStyle(theme => ({
  root: {
    flexBasis: '100%',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.m,
    paddingBottom: theme.spacing.m,
  },
  cardContainer: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.xl,
    borderRadius: 12,
  },
  image: {
    marginTop: theme.spacing.xl,
    alignSelf: 'center',
    height: 189,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    marginTop: theme.spacing.l,
    textAlign: 'center',
  },
  button: {
    marginTop: theme.spacing.l,
  },
}));

export default useStyles;
