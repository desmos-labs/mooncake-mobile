/**
 * Style hook for the ChangePassword screen
 */
import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    padding: theme.spacing.m,
    backgroundColor: theme.colors.background,
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
    backgroundColor: 'transparent',
  },
  confirmButtonText: {
    color: theme.colors.white,
    lineHeight: 30,
  },
  errorText: {
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
    color: theme.colors.error,
  },
  errorTextDtag: {
    marginBottom: theme.spacing.m,
    color: theme.colors.error,
  },
  labelGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  weakPw: {
    color: theme.colors.accentOrange01,
  },
  mediumPw: {
    color: theme.colors.accentYellow01,
  },
  strongPw: {
    color: theme.colors.accentGreen01,
  },
  dTagRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

export default useStyles;
