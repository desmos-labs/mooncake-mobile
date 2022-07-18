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
    justifyContent: 'flex-end',
  },
  confirmButtonText: {
    color: theme.colors.white,
    lineHeight: 30,
  },
  errorText: {
    marginTop: theme.spacing.xs,
    color: theme.colors.error,
  },
  tooltipGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.l,
  },
  check: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    marginRight: theme.spacing.xs,
  },
  tooltipValid: {
    color: theme.colors.accentGreen01,
  },
  tooltipText: {
    color: theme.colors.grey02,
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
}));

export default useStyles;
