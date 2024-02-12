import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  root: {
    padding: theme.spacings.m,
  },
  warningContainer: {
    backgroundColor: theme.colors.feedback.errorBg,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  warningText: {
    color: theme.colors.feedback.error,
  },
  passwordInput: {
    backgroundColor: theme.colors.neutralVariants['100'],
    borderRadius: 8,
    padding: 8,
  },
  wrongPasswordError: {
    paddingTop: 8,
    color: theme.colors.feedback.error,
  },
  privateKeyView: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.neutralVariants['300'],
  },
}));

export default useStyles;
