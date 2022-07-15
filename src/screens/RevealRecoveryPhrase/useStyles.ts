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
    color: theme.colors.white,
  },
  errorText: {
    color: theme.colors.pink01,
    marginTop: 8,
  },
  button: {
    borderRadius: theme.roundness,
  },
  disabled: {
    opacity: 0.3,
  },
}));

export default useStyles;
