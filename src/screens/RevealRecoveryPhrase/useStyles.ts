import {makeStyle} from 'config/theme';

/**
 * Style hook for the Settings screen
 */
const useStyles = makeStyle(theme => ({
  root: {
    padding: theme.spacing.m,
  },
  buttonGroup: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  formContainer: {
    flex: 1,
  },
  inputLabel: {
    marginBottom: theme.spacing.s,
  },
  confirmButtonText: {
    alignSelf: 'center',
    color: theme.colors.font[5],
  },
  errorText: {
    color: theme.colors.error,
    marginTop: 8,
  },
  button: {
    borderRadius: theme.roundness,
  },
  disabled: {
    opacity: 0.3,
  },
  gradient: {
    borderRadius: theme.roundness,
    height: 52,
    justifyContent: 'center',
  },
}));

export default useStyles;
