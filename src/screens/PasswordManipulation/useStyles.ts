/**
 * Style hook for the ChangePassword screen
 */
import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacings.m,
    paddingBottom: theme.spacings.s,
  },
  headerText: {
    marginBottom: theme.spacings.s,
  },
  descriptionText: {
    color: theme.colors.neutralVariants['700'],
  },
  formContainer: {
    flex: 1,
  },
  bottomLabel: {
    marginVertical: theme.spacings.s,
  },
  inputLabel: {
    borderRadius: 12,
  },
  confirmButtonText: {
    color: theme.colors.white,
    lineHeight: 30,
  },
  errorText: {
    marginTop: theme.spacings.xs,
    color: theme.colors.feedback.error,
  },
  labelGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: theme.spacings.s,
  },
  weakPw: {
    color: theme.colors.feedback.error,
  },
  mediumPw: {
    color: theme.colors.feedback.warning,
  },
  strongPw: {
    color: theme.colors.feedback.success,
  },
  marginXs: { marginTop: theme.spacings.xs },
}));

export default useStyles;
