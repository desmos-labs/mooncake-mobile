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
    color: theme.colors.font[5],
  },
  errorText: {
    color: theme.colors.error,
  },
}));

export default useStyles;
