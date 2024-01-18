import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  root: {
    padding: theme.spacing.m,
  },
  warningContainer: {
    backgroundColor: theme.colors.fedback.errorBg,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  warningText: {
    color: theme.colors.fedback.error,
  },
  passwordInput: {
    backgroundColor: theme.colors.neutral['100'],
    borderRadius: 8,
    padding: 8,
  },
  wrongPasswordError: {
    paddingTop: 8,
    color: theme.colors.fedback.error,
  },
  privateKeyView: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.neutral['300'],
  },
}));

export default useStyles;
