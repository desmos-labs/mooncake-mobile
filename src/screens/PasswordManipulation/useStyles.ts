/**
 * Style hook for the ChangePassword screen
 */
import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    padding: theme.spacing.m,
  },
  headerText: {
    marginBottom: theme.spacing.l,
  },
  formContainer: {
    flex: 1,
  },
  bottomLabel: {
    marginVertical: theme.spacing.s,
  },
  inputLabel: {
    borderWidth: 0.5,
    borderColor: theme.colors.lightGrey01,
    borderRadius: 8,
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
    marginVertical: theme.spacing.s,
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
  marginXs: { marginTop: theme.spacing.xs },
}));

export default useStyles;
