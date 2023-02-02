import { makeStyle } from 'config/theme';

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
  signOutButton: {
    borderColor: theme.colors.surfaceBlack,
    borderRadius: theme.roundness,
    padding: 1,
  },
  buttonContainer: {
    marginTop: theme.spacing.m,
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
