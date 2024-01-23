import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  input: {
    backgroundColor: theme.colors.neutral['100'],
  },
  error: {
    borderColor: theme.colors.fedback.error,
    backgroundColor: theme.colors.fedback.errorBg,
  },
  icon: {
    width: 24,
    height: 17.25,
  },
}));

export default useStyles;
