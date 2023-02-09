import { makeStyle } from 'config/theme';

/**
 * Style hook for the EnterPassword screen.
 */
const useStyles = makeStyle(theme => ({
  container: {
    padding: theme.spacing.m,
    backgroundColor: theme.colors.white,
    flex: 1,
  },
  headerText: {
    marginBottom: theme.spacing.m,
  },
  formContainer: {
    flex: 1,
  },
  inputLabel: {
    textTransform: 'capitalize',
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
    marginTop: theme.spacing.s,
    color: theme.colors.pink01,
  },
  textInput: {
    borderWidth: 1,
    borderColor: theme.colors.lightGrey01,
  },
}));

export default useStyles;
