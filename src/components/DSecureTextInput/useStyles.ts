import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  input: {
    backgroundColor: theme.colors.neutralVariants['100'],
  },
  error: {
    borderColor: theme.colors.feedback.error,
    backgroundColor: theme.colors.feedback.errorBg,
  },
  icon: {
    width: 24,
    height: 17.25,
  },
}));

export default useStyles;
