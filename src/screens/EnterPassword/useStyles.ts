import {makeStyle} from 'config/theme';

/**
 * Style hook for the EnterPassword screen.
 */
const useStyles = makeStyle(theme => ({
  container: {
    padding: theme.spacing.m,
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  headerText: {
    marginBottom: theme.spacing.m,
  },
  formContainer: {
    flex: 1,
  },
  inputLabel: {
    marginBottom: theme.spacing.s,
  },
  buttonGroup: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  forgotPwButton: {
    marginTop: theme.spacing.s,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: theme.colors.white,
  },
  errorText: {
    color: theme.colors.error,
  },
}));

export default useStyles;
