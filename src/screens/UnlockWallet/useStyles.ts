import { makeStyle } from 'config/theme';

/**
 * Style hook for the EnterPassword screen.
 */
const useStyles = makeStyle(theme => ({
  container: {
    paddingHorizontal: theme.spacings.m,
    backgroundColor: theme.colors.white,
    flex: 1,
  },
  headerText: {
    marginBottom: theme.spacings.m,
  },
  formContainer: {
    flex: 1,
    marginTop: theme.spacings.m,
  },
  inputLabel: {
    textTransform: 'capitalize',
    marginBottom: theme.spacings.s,
  },
  optionalBody: {
    marginTop: theme.spacings.m,
    marginBottom: theme.spacings.l,
  },
  buttonGroup: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  forgotPwButton: {
    marginTop: theme.spacings.s,
    alignItems: 'center',
  },
  errorText: {
    marginTop: theme.spacings.s,
    color: theme.colors.feedback.error,
  },
  textInput: {
    backgroundColor: theme.colors.neutralVariants['100'],
    borderRadius: 8,
    padding: 8,
  },
}));

export default useStyles;
