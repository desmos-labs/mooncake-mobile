/**
 * Style hook for the ChangePassword screen
 */
import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    padding: theme.spacing.l,
    backgroundColor: theme.colors.background,
  },
  headerText: {
    marginBottom: theme.spacing.m,
  },
  tooltipText: {
    marginBottom: theme.spacing.l,
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
  confirmButtonText: {
    color: theme.colors.font[5],
  },
  errorText: {
    color: theme.colors.error,
  },
}));

export default useStyles;
