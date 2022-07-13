import {makeStyle} from 'config/theme';

/**
 * Style hook for the Settings screen
 */
const useStyles = makeStyle(theme => ({
  root: {
    padding: theme.spacing.m,
  },
  title: {
    marginBottom: 24,
  },
  scrollViewOuter: {
    margin: -20,
  },
  scrollViewInner: {
    padding: 20,
  },
  signOutButton: {
    marginTop: theme.spacing.l,
    borderRadius: theme.roundness,
    padding: 1,
  },
  innerButton: {
    backgroundColor: theme.colors.background,
    borderWidth: 0,
  },
  spacer: {
    marginBottom: 24,
  },
  bottomText: {
    textAlign: 'center',
    marginVertical: theme.spacing.m,
  },
}));

export default useStyles;
