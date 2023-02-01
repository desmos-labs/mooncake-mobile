/**
 * Style hook for the ChangePassword screen
 */
import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    padding: theme.spacing.m,
    backgroundColor: 'transparent',
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
  confirmButtonText: {
    color: theme.colors.white,
    lineHeight: 30,
  },
  errorText: {
    marginTop: theme.spacing.xs,
    color: theme.colors.pink01,
  },
  labelGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  weakPw: {
    color: theme.colors.accentRed01,
  },
  mediumPw: {
    color: theme.colors.accentYellow01,
  },
  strongPw: {
    color: theme.colors.accentGreen01,
  },
  loadingView: {
    alignItems: 'center',
    paddingVertical: theme.spacing.m,
  },
}));

export default useStyles;
